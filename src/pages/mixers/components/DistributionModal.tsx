import {
    Box,
    Checkbox,
    FormControl,
    FormErrorMessage,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

import { ShiftAccountingType } from '@/utils/types/shiftAccounting.types'
import { useForm } from 'react-hook-form'
import { FacilityUnit } from '@/utils/types/product.types'
import { useApi } from '@/utils/services/axios'
import { DepartPersonalType } from '@/utils/types/departPersonal.types'
import { createShiftAccounting } from '@/utils/services/shiftAccounting.service'
import { useNotify } from '@/utils/hooks/useNotify'

interface DistributionModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    onSuccess: () => void
    data: ShiftAccountingType | undefined
}

type DepartPersonalNames = { id: number; name: string; hours: number; facilityUnit: number }

const DistributionModal: React.FC<DistributionModalProps> = ({
    data,
    isOpen,
    onClose,
    onSuccess,
}) => {
    const { loading, error } = useNotify()
    const { data: facilityUnits } = useApi<FacilityUnit[] | undefined>(`mixers`)
    const { data: departPersonalData } = useApi<DepartPersonalType[]>('departPersonal?status=1')

    const [selectedFacilityUnit, setSelectedFacilityUnit] = useState<string>('')
    const [selectedPersonals, setSelectedPersonals] = useState<DepartPersonalNames[]>([])

    const {
        register,
        handleSubmit: handleSubmitForm,
        setValue,
        formState: { errors },
        reset,
        getValues,
    } = useForm<ShiftAccountingType>()

    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                setValue(key as keyof ShiftAccountingType, value)
            })
        } else {
            reset()
        }
    }, [data, isOpen, reset])

    const handleConfirm = () => {
        const date = getValues('date')

        if (selectedPersonals.length < 1) {
            error('Выберите персонал')
            return
        }

        const distributionData = {
            facilityUnitsId: selectedFacilityUnit,
            date: date,
            departPersonals: selectedPersonals.map(({ name, id, hours }) => ({
                name,
                id,
                hours,
            })),
        }

        const responsePromise: Promise<any> = createShiftAccounting(distributionData)
        loading(responsePromise)

        responsePromise
            .then(() => {
                onSuccess()
                onClose()
                setSelectedPersonals([])
                setSelectedFacilityUnit('')
            })
            .catch((error) => {
                console.error('Error creating:', error)
            })
    }

    const handlePersonalSelection = (name: string, id: number, facilityUnit: number) => {
        if (selectedPersonals.find((item) => item.name === name)) {
            setSelectedPersonals(
                selectedPersonals
                    .map((item) => (item.name === name ? null : item))
                    .filter((item) => item !== null) as {
                    id: number
                    name: string
                    hours: number
                    facilityUnit: number
                }[],
            )
        } else {
            setSelectedPersonals([...selectedPersonals, { name, id, hours: 1, facilityUnit }])
        }
    }

    const handleClose = () => {
        setSelectedFacilityUnit('')
        setSelectedPersonals([])
        onClose()
        reset()
    }

    const handleFacilityUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFacilityUnit(event.target.value)
    }

    const handleHoursChange = (event: React.ChangeEvent<HTMLInputElement>, breadName: string) => {
        const hours = parseInt(event.target.value)

        setSelectedPersonals(
            selectedPersonals.map((bread) =>
                bread.name === breadName ? { ...bread, hours } : bread,
            ),
        )
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{data ? 'Изменить' : 'Добавить'} часы</ModalHeader>
                <ModalCloseButton />
                <ModalBody display='flex' gap='10px' flexDirection='column'>
                    <form
                        onSubmit={handleSubmitForm(handleConfirm)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                    >
                        <FormControl isInvalid={!!errors.bakingFacilityUnitId}>
                            <Select
                                {...register('bakingFacilityUnitId', {
                                    required: 'Поле является обязательным',
                                })}
                                placeholder='Цех'
                                defaultValue={data ? data.bakingFacilityUnitId : ''}
                                onChange={handleFacilityUnitChange}
                            >
                                {facilityUnits?.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.facilityUnit}
                                    </option>
                                ))}
                            </Select>

                            <FormErrorMessage>
                                {errors.bakingFacilityUnitId?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.date}>
                            <Input
                                {...register('date', {
                                    required: 'Поле является обязательным',
                                })}
                                autoComplete='off'
                                placeholder='Дата *'
                                type='date'
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                        </FormControl>

                        {selectedFacilityUnit && (
                            <>
                                <Box
                                    width='100%'
                                    gap='10px'
                                    border='1px solid #E2E8F0'
                                    padding='5px'
                                    borderRadius='8px'
                                    marginTop='5px'
                                    display='flex'
                                    flexWrap='wrap'
                                >
                                    {departPersonalData?.map((user) => {
                                        if (
                                            user.bakingFacilityUnit.id ===
                                            Number(selectedFacilityUnit)
                                        ) {
                                            return (
                                                <Checkbox
                                                    w='45%'
                                                    p='0 15px'
                                                    checked={selectedPersonals.some(
                                                        (item) => item.name === user.name,
                                                    )}
                                                    onChange={() =>
                                                        handlePersonalSelection(
                                                            user.name,
                                                            user.id,
                                                            user.bakingFacilityUnit.id,
                                                        )
                                                    }
                                                    key={user.name}
                                                >
                                                    <Text>{user.name}</Text>
                                                </Checkbox>
                                            )
                                        }
                                    })}
                                </Box>
                                <Box display='flex' flexDirection='column' gap='10px' pl={1}>
                                    {selectedPersonals.map(({ name, hours }, index) => {
                                        return (
                                            <Box
                                                width='100%'
                                                display='flex'
                                                gap='10px'
                                                alignItems='center'
                                                key={name}
                                            >
                                                <Text w='40%'>
                                                    {index + 1}. {name}
                                                </Text>
                                                <Input
                                                    w='60%'
                                                    required={hours > 1}
                                                    type='number'
                                                    placeholder='Кол-во'
                                                    value={isNaN(hours) ? '' : hours.toString()}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value
                                                        if (
                                                            newValue === '' ||
                                                            (!isNaN(parseInt(newValue)) &&
                                                                parseInt(newValue) >= 0 &&
                                                                parseInt(newValue) <= 24)
                                                        ) {
                                                            handleHoursChange(e, name)
                                                        }
                                                    }}
                                                    min='0'
                                                    onKeyDown={(e) => {
                                                        if (e.key === '-') {
                                                            e.preventDefault()
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        )
                                    })}
                                </Box>
                            </>
                        )}

                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '10px',
                            }}
                        >
                            <Input
                                width='40%'
                                type='submit'
                                bg='purple.500'
                                color='white'
                                cursor='pointer'
                                value={data ? 'Редактировать' : 'Добавить'}
                            />
                        </Box>
                    </form>
                </ModalBody>

                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DistributionModal
