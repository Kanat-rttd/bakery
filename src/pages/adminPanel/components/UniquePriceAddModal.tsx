import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    ModalFooter,
    ModalOverlay,
    Box,
    Text,
    Input,
    InputGroup,
    InputRightAddon,
    Select,
    FormControl,
    FormErrorMessage,
} from '@chakra-ui/react'
import { getAllProducts } from '@/utils/services/product.service'
import { useState, useEffect, useMemo } from 'react'
import { getAllClients } from '@/utils/services/client.service'
import {
    createIndividualPrice,
    updateIndividualPrice,
} from '@/utils/services/individualPrices.service'
import { useApi } from '@/utils/services/axios'
import { useForm } from 'react-hook-form'
import { ClientType } from '@/utils/types/client.type'
import { UniquePriceDetail, UniquePriceType } from '@/utils/types/uniquePrice.types'
import { individualPriceType } from '@/utils/types/individualPrice.types'
import InputNumber from '@/components/shared/NumberInput'
import { useNotify } from '@/utils/hooks/useNotify'

interface Product {
    id: string
    name: string
    price: string
    costPrice: string
    status: string
    bakingFacilityUnit: {
        facilityUnit: string
        id: string
    }
}

interface UniquePriceAddModal {
    data: UniquePriceType | undefined
    selectedRelease: string
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const UniquePriceAddModal = ({
    data,
    selectedRelease,
    isOpen,
    onClose,
    onSuccess,
}: UniquePriceAddModal) => {
    const { error, success } = useNotify()
    const { data: individualPrices, mutate } = useApi<individualPriceType[]>('inPrice')
    const [products, setProducts] = useState<Product[]>([])
    // const [selectedProduct, setSelectedProduct] = useState('')
    const [clientsData, setClientsData] = useState<ClientType[]>([])

    const {
        register,
        handleSubmit: handleSubmitForm,
        setValue,
        formState: { errors },
        reset,
    } = useForm<UniquePriceDetail>()

    useEffect(() => {
        getAllProducts().then((responseData) => {
            setProducts(responseData)
        })
    }, [])

    useEffect(() => {
        if (data && data.detail.length > 0) {
            const firstDetail = data.detail[0]
            Object.entries(firstDetail).forEach(([key, value]) => {
                setValue(key as keyof UniquePriceDetail, value)
            })
            setValue('name', String(data.detail[0].id))
            setValue('price', data.detail[0].price)
        } else {
            reset()
        }
    }, [data])

    useEffect(() => {
        getAllClients({ name: '', telegrammId: '', status: '' }).then((responseData) => {
            setClientsData(responseData)
        })
    }, [])

    const handleAddOrUpdate = (formData: UniquePriceDetail) => {
        try {
            let newData

            if (data == undefined) {
                newData = {
                    clientId:
                        clientsData?.find((client) => client.name == selectedRelease)?.id || '',
                    detail: [
                        {
                            id: formData.name,
                            name:
                                products.find((product) => product.id == formData.name)?.name || '',
                            price: formData.price,
                        },
                    ],
                }
                const responsePromise: Promise<any> = createIndividualPrice(newData)
                responsePromise.then((res) => {
                    reset()
                    handleCancel()
                    onSuccess()
                    mutate()
                    success(res.data.message)
                    reset()
                })
            } else {
                newData = {
                    clientId:
                        clientsData?.find((client) => client.name == data.clientName)?.id || '',
                    detail: [
                        {
                            id: data.detail[0].id,
                            name:
                                products.find((product) => product.id == data.detail[0].id)?.name ||
                                '',
                            price: formData.price,
                        },
                    ],
                }
                const responsePromise: Promise<any> = updateIndividualPrice(
                    newData.clientId,
                    newData,
                )
                responsePromise.then((res) => {
                    reset()
                    handleCancel()
                    onSuccess()
                    mutate()
                    success(res.data.message)
                    reset()
                })
            }
        } catch (err: any) {
            // setError('root', {
            //     message: error.response.data.message || 'Ошибка',
            // })
            error(err.response.data.message)
        }
    }

    const handleCancel = () => {
        onClose()
    }

    const filteredProducts = useMemo(() => {
        return products?.filter((product) => {
            if (individualPrices) {
                return individualPrices.find((client) => {
                    if (client.clientName === selectedRelease) {
                        if (!client.detail.length) {
                            return true
                        }
                        return !client.detail.some((detail) => detail.id === product.id)
                    }
                })
            }
            return false
        })
    }, [products, individualPrices, selectedRelease, isOpen, data])

    return (
        <>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>{data ? 'Изменить цены' : 'Добавить цену продукта'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4}>
                            <Box display='flex' flexDirection='column' gap='15px'>
                                <form
                                    onSubmit={handleSubmitForm(handleAddOrUpdate)}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '15px',
                                    }}
                                >
                                    <Box display='flex' gap='10px'>
                                        <Text>Реализатор:</Text>
                                        <Text fontWeight={600}>{selectedRelease}</Text>
                                    </Box>
                                    <FormControl isInvalid={!!errors.name}>
                                        <Select
                                            {...register('name', {
                                                required: 'Поле является обязательным',
                                            })}
                                            variant='filled'
                                            placeholder='Продукт'
                                            isDisabled={!!data}
                                        >
                                            {(data ? products : filteredProducts).map((product) => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name}
                                                </option>
                                            ))}
                                        </Select>
                                        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.price}>
                                        <InputGroup>
                                            <InputNumber
                                                {...register('price', {
                                                    required: 'Поле является обязательным',
                                                })}
                                                placeholder='Цена'
                                            />
                                            <InputRightAddon>₸</InputRightAddon>
                                        </InputGroup>
                                        <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                                    </FormControl>

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
                            </Box>
                        </Stack>
                    </ModalBody>
                    <ModalFooter gap={3}></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UniquePriceAddModal
