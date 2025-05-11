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
    Input,
    InputRightAddon,
    InputGroup,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import { createPurchase } from '@/utils/services/productPurchase.service'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useApi } from '@/utils/services/axios'
import { useNotify } from '@/utils/hooks/useNotify'
import { ProviderType } from '@/utils/types/provider.types'
import { PurchaseType } from '@/utils/types/purchase.types'
import InputNumber from '@/components/shared/NumberInput'

type PurchaseModalProps = {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

interface rawMaterials {
    providerId: number
    value: number
    label: string
    uom: string
    category: number
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

const PurchaseModal = ({ isOpen, onClose, onSuccess }: PurchaseModalProps) => {
    const { loading } = useNotify()

    const { data: providerGoodsData } = useApi<ProviderGoods[]>('providerGoods?status=1')
    const { data: providersData } = useApi<ProviderType[]>('providers?status=1')

    const [providerGoods, setProviderGoods] = useState<rawMaterials[]>([])

    console.log('providerGoods', providerGoods)

    useEffect(() => {
        const _providerGoods = providerGoodsData?.map((item) => {
            return {
                providerId: item.providerId,
                label: item.goods,
                value: item.id,
                uom: item.unitOfMeasure,
                category: item.goodsCategoryId,
            }
        })
        console.log(_providerGoods)

        setProviderGoods(_providerGoods || [])
    }, [providerGoodsData])

    const [selectedRawMaterial, setSelectedRawMaterial] = useState<rawMaterials | null>(null)
    const [filteredProviderGoods, setFilteredProviderGoods] = useState<rawMaterials[]>([])

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm<PurchaseType>()

    const status = [
        { value: 1, label: 'Оплачено' },
        { value: 2, label: 'Не оплачено' },
    ]

    const sendData = (formData: PurchaseType) => {
        const response: Promise<any> = createPurchase({
            ...formData,
            goodsCategoryId: selectedRawMaterial?.category,
        })
        loading(response)
        response
            .then(() => {
                onSuccess()
                reset()
                onClose()
            })
            .catch((error) => {
                console.error('Error creating sale:', error)
            })
    }

    const handleProviderChange = (selectedOption: ProviderType | null) => {
        const selectedProviderId = selectedOption?.id

        if (selectedProviderId) {
            const filteredGoods = providerGoods.filter(
                (good) => good.providerId === selectedProviderId,
            )
            setFilteredProviderGoods(filteredGoods)
        } else {
            setFilteredProviderGoods([])
        }

        setValue('providerId', selectedOption?.id ?? 0)
        setSelectedRawMaterial(null)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Добавить закупки</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box display='flex' flexDirection='column' gap={3}>
                        <FormControl isInvalid={!!errors.providerId}>
                            <Controller
                                name='providerId'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { value } = field
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
                                            onChange={handleProviderChange}
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
                                            options={filteredProviderGoods}
                                            defaultValue={filteredProviderGoods?.filter(
                                                (option) => option.value == value,
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
                                <InputRightAddon w='15%' display='flex' justifyContent='center'>
                                    {selectedRawMaterial?.uom}
                                </InputRightAddon>
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
                                defaultValue={new Date().toISOString().split('T')[0]}
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
                                            value={status?.find(
                                                (option) => option?.label === value,
                                            )}
                                            onChange={(val: any) => {
                                                return onChange(val)
                                            }}
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
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                        Отмена
                    </Button>
                    <Button colorScheme='purple' onClick={handleSubmitForm(sendData)}>
                        Добавить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default PurchaseModal
