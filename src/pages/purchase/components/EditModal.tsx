import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    FormControl,
    FormErrorMessage,
    InputGroup,
    Input,
    InputRightAddon,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { updatePurchase } from '@/utils/services/productPurchase.service'
import { useState, useEffect } from 'react'
import { useApi } from '@/utils/services/axios'
import dayjs from 'dayjs'
import { PurchaseType } from '@/utils/types/purchase.types'
import InputNumber from '@/components/shared/NumberInput'
import { ProviderType } from '@/utils/types/provider.types'

interface rawMaterials {
    value: number
    label: string
    uom: string
    category: number
}

type EditModalProps = {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    selectedData: PurchaseType | undefined
}

interface ProviderGoods {
    id: number
    providerId: number
    goods: string
    goodsCategoryId: number
    unitOfMeasure: string
    place: { label: string }[]
    status: string
    provider: {
        id: number
        name: string
    }
}
const EditModal = ({ isOpen, onClose, selectedData, onSuccess }: EditModalProps) => {
    const { data: providersData } = useApi<ProviderType[]>('providers')
    const { data: providerGoodsData } = useApi<ProviderGoods[]>('providerGoods')

    const [providerGoods, setProviderGoods] = useState<rawMaterials[]>([])
    const [selectedRawMaterial, setSelectedRawMaterial] = useState<rawMaterials | undefined>(
        undefined,
    )

    useEffect(() => {
        const _providerGoods = providerGoodsData?.map((item) => {
            return {
                label: item.goods,
                value: item.id,
                uom: item.unitOfMeasure,
                category: item.goodsCategoryId,
            }
        })
        setProviderGoods(_providerGoods || [])
    }, [providerGoodsData])

    useEffect(() => {
        const _rowMaterial = {
            label: selectedData?.providerGood.goods || '',
            value: selectedData?.providerGood.id || 0,
            uom: selectedData?.goodsCategory.unitOfMeasure || '',
            category: selectedData?.goodsCategoryId || 0,
        }

        setSelectedRawMaterial(_rowMaterial || [])
    }, [selectedData])

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        setValue,
        reset,
    } = useForm<PurchaseType>()

    useEffect(() => {
        if (selectedData) {
            Object.entries(selectedData).forEach(([key, value]) => {
                setValue(key as keyof PurchaseType, value)
            })
            setValue('providerId', selectedData.providerId)
            setValue('providerGoodId', selectedData.providerGood.id)
            console.log(selectedData.providerGoodId)

            setValue('date', dayjs(selectedData.date).format('YYYY-MM-DD'))
        } else {
            reset()
        }
    }, [selectedData, isOpen, reset])

    const status = [
        { value: 1, label: 'Оплачено' },
        { value: 2, label: 'Не оплачено' },
    ]

    const updateData = (formData: PurchaseType) => {
        const purchaseId = selectedData?.id?.toString() ?? ''
        updatePurchase(purchaseId, { ...formData, goodsCategoryId: selectedRawMaterial?.category })
            .then(() => {
                onSuccess()
                handleClose()
            })
            .catch((error) => {
                console.error('Error creating sale:', error)
            })
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Изменить</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box display='flex' flexDirection='column' gap={3}>
                        <FormControl isInvalid={!!errors.providerId}>
                            <Controller
                                name='providerId'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={providersData}
                                            getOptionLabel={(option: ProviderType) =>
                                                option.providerName
                                            }
                                            getOptionValue={(option: ProviderType) =>
                                                `${option.id}`
                                            }
                                            value={providersData?.filter(
                                                (option) => String(option.id) == String(value),
                                            )}
                                            onChange={(selectedOption: ProviderType | null) => {
                                                onChange(selectedOption?.id)
                                            }}
                                            placeholder='Поставщик *'
                                            isClearable
                                            isSearchable
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.providerId?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.providerGoodId}>
                            <Controller
                                name='providerGoodId'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={providerGoods}
                                            value={providerGoods?.filter(
                                                (option) => String(option.value) == String(value),
                                            )}
                                            onChange={(selectedOption: rawMaterials | null) => {
                                                if (selectedOption) {
                                                    onChange(selectedOption.value)
                                                    setSelectedRawMaterial(selectedOption)
                                                }
                                            }}
                                            placeholder='Товар *'
                                            isClearable
                                            isSearchable
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.providerGoodId?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.quantity}>
                            <InputGroup>
                                <Input
                                    {...register('quantity', {
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
                                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                                            e.preventDefault()
                                        }
                                    }}
                                />
                                <InputRightAddon>{selectedRawMaterial?.uom}</InputRightAddon>
                            </InputGroup>
                            <FormErrorMessage>{errors.quantity?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.price}>
                            <InputNumber
                                {...register('price', { required: 'Поле является обязательным' })}
                                placeholder='Цена *'
                            />
                            <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.deliverySum}>
                            <InputNumber
                                {...register('deliverySum', {
                                    required: 'Поле является обязательным',
                                })}
                                placeholder='Сумма доставки *'
                            />
                            <FormErrorMessage>{errors.deliverySum?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.date}>
                            <Input
                                {...register('date', {
                                    required: 'Поле является обязательным',
                                })}
                                autoComplete='off'
                                placeholder='Дата *'
                                type='date'
                            />
                            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.status}>
                            <Controller
                                name='status'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={status}
                                            defaultValue={
                                                value
                                                    ? status?.filter(
                                                          (option) => option.label == value,
                                                      )
                                                    : null
                                            }
                                            onChange={(val: any) => onChange(val)}
                                            placeholder='Статус *'
                                            isClearable
                                            isSearchable
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
                        </FormControl>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button colorScheme='purple' onClick={handleSubmitForm(updateData)}>
                        Изменить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditModal
