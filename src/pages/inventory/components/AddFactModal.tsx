import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormErrorMessage,
    InputGroup,
    Input,
    Box,
    InputRightAddon,
} from '@chakra-ui/react'
import { useApi } from '@/utils/services/axios'
import classes from '../index.module.css'

import Select from 'react-select'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { createFactInput } from '@/utils/services/factInput.service'
import { CloseIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import { useNotify } from '@/utils/hooks/useNotify'

type AddFactModalInputs = {
    place: string
    details: {
        goodsCategoryId: number | null
        quantity: number | null
        unitOfMeasure: string | null
    }[]
}

interface Place {
    label: string
}

type FactModalProps = {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}
type GoodsCategoryType = {
    id: number
    category: string
    unitOfMeasure: string
}

const FactModal = ({ isOpen, onClose, onSuccess }: FactModalProps) => {
    const { loading } = useNotify()
    const { data: goodsCategoriesData } = useApi<GoodsCategoryType[]>('goodsCategories')
    const { data: placesData } = useApi<Place[]>('place')
    const [selectedUnitsOfMeasure, setSelectedUnitsOfMeasure] = useState<string[]>([])

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        reset,
        formState: { errors },
    } = useForm<AddFactModalInputs>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details',
    })

    const sendData = (formData: AddFactModalInputs) => {
        const responsePromise: Promise<any> = createFactInput(formData)
        loading(responsePromise)
        responsePromise
            .then(() => {
                onSuccess()
                onClose()
                reset()
            })
            .catch((error) => {
                console.error('Error updating data:', error)
            })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Ввод фактического количества</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box display='flex' flexDirection='column' gap={2}>
                        <FormControl isInvalid={!!errors.place}>
                            <Controller
                                name='place'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={placesData}
                                            getOptionLabel={(option: Place) => option.label}
                                            getOptionValue={(option: Place) => `${option.label}`}
                                            value={placesData?.filter(
                                                (option) => String(option.label) == value,
                                            )}
                                            onChange={(selectedOption: Place | null) => {
                                                onChange(selectedOption?.label)
                                            }}
                                            placeholder='Место *'
                                            isClearable
                                            isSearchable
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.place?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl mt={3} w='100%' display='flex' flexDirection='column' gap={3}>
                            {fields.map((_, index) => {
                                return (
                                    <Box display='flex' gap={2} alignItems='center' key={index}>
                                        <Controller
                                            name={`details.${index}.goodsCategoryId`}
                                            control={control}
                                            rules={{ required: 'Поле является обязательным' }}
                                            render={({ field }) => {
                                                const { onChange, value } = field
                                                return (
                                                    <Select
                                                        options={goodsCategoriesData?.filter(
                                                            (item) => {
                                                                const category = fields.filter(
                                                                    (_, i) => index > i,
                                                                )
                                                                return !category.find(
                                                                    (category) =>
                                                                        category.goodsCategoryId ==
                                                                        item.id,
                                                                )
                                                            },
                                                        )}
                                                        getOptionLabel={(
                                                            option: GoodsCategoryType,
                                                        ) => option.category}
                                                        getOptionValue={(
                                                            option: GoodsCategoryType,
                                                        ) => `${option.id}`}
                                                        value={goodsCategoriesData?.filter(
                                                            (option) =>
                                                                String(option.id) == String(value),
                                                        )}
                                                        onChange={(selectedOption) => {
                                                            onChange(selectedOption?.id)
                                                            const selectedUnitOfMeasure =
                                                                goodsCategoriesData?.find(
                                                                    (category) =>
                                                                        category.id ===
                                                                        selectedOption?.id,
                                                                )?.unitOfMeasure || ''
                                                            setSelectedUnitsOfMeasure(
                                                                (prevUnitsOfMeasure) => {
                                                                    const newUnitsOfMeasure = [
                                                                        ...prevUnitsOfMeasure,
                                                                    ]
                                                                    newUnitsOfMeasure[index] =
                                                                        selectedUnitOfMeasure
                                                                    return newUnitsOfMeasure
                                                                },
                                                            )
                                                        }}
                                                        placeholder='Категория'
                                                        isSearchable
                                                        className={classes.select}
                                                    />
                                                )
                                            }}
                                        />
                                        <InputGroup>
                                            <Input
                                                {...register(`details.${index}.quantity`, {
                                                    required: 'Поле является обязательным',
                                                })}
                                                placeholder='Количество'
                                                type='number'
                                                autoComplete='off'
                                                min='0'
                                                onKeyDown={(e) => {
                                                    if (e.key === '-') {
                                                        e.preventDefault()
                                                    }
                                                    if (e.key === 'e') {
                                                        e.preventDefault()
                                                    }
                                                    if (
                                                        e.key === 'ArrowUp' ||
                                                        e.key === 'ArrowDown'
                                                    ) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                            />
                                            <InputRightAddon
                                                w='25%'
                                                display='flex'
                                                justifyContent='center'
                                            >
                                                {selectedUnitsOfMeasure[index] || ''}
                                            </InputRightAddon>
                                        </InputGroup>
                                        {fields.length > 1 && (
                                            <CloseIcon
                                                ml={2}
                                                cursor='pointer'
                                                onClick={() => remove(index)}
                                            />
                                        )}
                                    </Box>
                                )
                            })}
                            <Button
                                onClick={() => {
                                    append({
                                        goodsCategoryId: null,
                                        quantity: null,
                                        unitOfMeasure: '',
                                    })
                                }}
                            >
                                Добавить
                            </Button>
                        </FormControl>
                        {/* {goodsCategoriesData &&
                            goodsCategoriesData.map((item, index) => {
                                return (
                                    <Box
                                        display={'flex'}
                                        flexDirection={'row'}
                                        alignItems={'center'}
                                        justifyContent={'space-between'}
                                        key={index}
                                    >
                                        <Text>{item.goods}</Text>
                                        <FormControl
                                            width={'70%'}
                                            key={item.id}
                                            isInvalid={!!errors[`quantity_${index}`]}
                                        >
                                            <InputGroup>
                                                <Input
                                                    {...register(`quantity_${index}`)}
                                                    autoComplete="off"
                                                    placeholder={`Количество ${item.goods} *`}
                                                    type="text"
                                                />
                                                <InputRightAddon>
                                                    {item.goodsCategory.unitOfMeasure}
                                                </InputRightAddon>
                                            </InputGroup>
                                            <FormErrorMessage>
                                                {(errors as any)[`quantity_${index}`]?.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </Box>
                                )
                            })} */}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                        Закрыть
                    </Button>
                    <Button colorScheme='purple' onClick={handleSubmitForm(sendData)}>
                        Добавить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default FactModal
