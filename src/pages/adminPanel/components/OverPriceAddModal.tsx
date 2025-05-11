import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalOverlay,
    Button,
    InputGroup,
    FormControl,
    FormErrorMessage,
    InputRightAddon,
} from '@chakra-ui/react'

import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useApi } from '@/utils/services/axios'
import { createOverprice, updateOverprice } from '@/utils/services/overprice.service'
import { OverPriceInputs, OverPriceType } from '@/utils/types/overPrice.types'
import { monthData } from '@/utils/constants/month.consts'
import { ContragentCategoryType, ContragentType } from '@/utils/types/contragent.types'
import InputNumber from '@/components/shared/NumberInput'
import { useNotify } from '@/utils/hooks/useNotify'

const defaultValues = {
    contragentId: 0,
    month: '',
    year: '',
    price: '',
}

interface months {
    id: number
    name: string
}

interface OverPriceAddModalProps {
    data: OverPriceType | undefined
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const OverPriceAddModal = ({ data, isOpen, onClose, onSuccess }: OverPriceAddModalProps) => {
    const { success, error } = useNotify()
    const { data: contragentsTypesData } = useApi<ContragentCategoryType[]>('contragentType')

    const { data: clientData } = useApi<ContragentType[]>(
        `contragent?type=${
            contragentsTypesData?.find((item) => item.type === 'реализатор')?.id
        }&status=1`,
    )

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        setValue,
        formState: { errors },
        reset,
    } = useForm<OverPriceInputs>({
        defaultValues: {
            month: String(new Date().getMonth() + 1),
            year: new Date().getFullYear().toString(),
        },
    })

    const sendData = (formData: OverPriceInputs) => {
        if (data) {
            updateOverprice(data.id, formData)
                .then(() => {
                    onSuccess()
                    success('Успешно')
                })
                .catch((err) => {
                    error(err.response.data.error)
                })
        } else {
            createOverprice(formData)
                .then(() => {
                    onSuccess()
                    success('Успешно')
                })
                .catch((err) => {
                    error(err.response.data.error)
                })
        }
        handleClose()
    }

    useEffect(() => {
        if (data) {
            setValue('contragentId', data.contragentId)
            setValue('month', data.month)
            setValue('year', data.year)
            setValue('price', data.price)
        }
    }, [data])

    const handleClose = () => {
        reset({
            ...defaultValues,
            month: String(new Date().getMonth() + 1),
            year: new Date().getFullYear().toString(),
        })
        onClose()
    }

    return (
        <>
            <Modal isCentered isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>{data ? 'Редактировать' : 'Добавить'} Сверху</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDirection='column' gap={3}>
                        <FormControl isInvalid={!!errors.contragentId}>
                            <Controller
                                name='contragentId'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={clientData}
                                            getOptionLabel={(option: ContragentType) =>
                                                option.contragentName
                                            }
                                            getOptionValue={(option: ContragentType) =>
                                                `${option.id}`
                                            }
                                            value={clientData?.filter(
                                                (option: ContragentType) =>
                                                    Number(option.id) == value,
                                            )}
                                            onChange={(selectedOption: ContragentType | null) => {
                                                if (selectedOption) {
                                                    onChange(selectedOption.id)
                                                }
                                            }}
                                            placeholder='Реализатор *'
                                            isClearable
                                            isSearchable
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.contragentId?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.month}>
                            <Controller
                                name='month'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={monthData}
                                            getOptionLabel={(option: months) => option.name}
                                            getOptionValue={(option: months) => `${option.id}`}
                                            value={monthData?.filter(
                                                (option: months) => option.id == Number(value),
                                            )}
                                            onChange={(selectedOption: months | null) => {
                                                if (selectedOption) {
                                                    onChange(selectedOption.id)
                                                }
                                            }}
                                            placeholder='Месяц *'
                                            isClearable
                                            isSearchable
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.month?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.year}>
                            <InputNumber
                                {...register('year', {
                                    required: 'Поле является обязательным',
                                    minLength: {
                                        value: 4,
                                        message: 'Некорректный год.',
                                    },
                                    maxLength: {
                                        value: 4,
                                        message: 'Некорректный год.',
                                    },
                                })}
                                placeholder='Год *'
                            />
                            <FormErrorMessage>{errors.year?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.price}>
                            <InputGroup>
                                <InputNumber
                                    {...register('price', {
                                        required: 'Поле является обязательным',
                                    })}
                                    placeholder='Сверху *'
                                />
                                <InputRightAddon>тг</InputRightAddon>
                            </InputGroup>
                            <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button onClick={handleClose} colorScheme='red'>
                            Отмена
                        </Button>
                        <Button colorScheme='purple' onClick={handleSubmitForm(sendData)}>
                            {data ? 'Редактировать' : 'Добавить'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default OverPriceAddModal
