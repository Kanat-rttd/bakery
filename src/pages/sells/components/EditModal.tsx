import React, { useEffect } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    InputGroup,
    Input,
    Box,
    Text,
    Select,
} from '@chakra-ui/react'

import { updateDispatchPrice } from '@/utils/services/dispatch.service'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { useApi } from '@/utils/services/axios'
// import { ClientType } from '@/utils/types/client.type'
import { Product } from '@/utils/types/product.types'
import { useNotify } from '@/utils/hooks/useNotify'
import InputNumber from '@/components/shared/NumberInput'
import { ContragentType } from '@/utils/types/contragent.types'

interface DispatchType {
    id: number
    contragentId: number
    createdAt: string
    dispatch: string
    goodsDispatchDetails: {
        id: number
        productId: number
        quantity: number
        price: number
        product: {
            name: string
            price: number
            bakingFacilityUnit: {
                id: number
                facilityUnit: string
            }
        }
    }[]
    contragent: {
        id: number
        contragentName: string
    }
}

interface EditModalProps {
    isOpen: boolean
    onClose: () => void
    selectedRow: DispatchType | null
    onSuccess: () => void
}

type FormData = {
    contragentId: number
    products: { productId: number; quantity: number; price: number }[]
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, selectedRow, onSuccess }) => {
    const { loading } = useNotify()
    // const { data: clients } = useApi<ClientType[]>('client')

    const { data: contragents } = useApi<ContragentType[]>('contragent?type=1')

    const { data: products } = useApi<Product[]>('product')

    console.log(selectedRow)

    const {
        register,
        reset,
        setValue,
        control,
        setError,
        handleSubmit: handleSubmitForm,
    } = useForm<FormData>()

    const { fields } = useFieldArray({
        control,
        name: 'products',
    })

    useEffect(() => {
        if (selectedRow) {
            const data = selectedRow?.goodsDispatchDetails.map((detail) => {
                return {
                    productId: Number(detail.productId),
                    quantity: Number(detail.quantity),
                    price: Number(detail.price),
                }
            })
            console.log(selectedRow.contragent.id)
            setValue('contragentId', Number(selectedRow.contragent.id))
            setValue('products', data)
        } else {
            reset()
        }
    }, [selectedRow])

    const updateData: SubmitHandler<FormData> = (formData) => {
        if (!selectedRow) return
        try {
            const responsePromise: Promise<any> = updateDispatchPrice(selectedRow.id, formData)
            loading(responsePromise)
            responsePromise.then(() => {
                reset()
                onSuccess()
                onClose()
            })
        } catch (error: any) {
            setError('root', {
                message: error.response.data.message || 'Ошибка',
            })
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign='center'>Изменить</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form
                        onSubmit={handleSubmitForm(updateData)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                    >
                        <FormControl>
                            <Select
                                {...register('contragentId', {
                                    required: 'Поле является обязательным',
                                })}
                                variant='filled'
                                placeholder='Имя клиента'
                            >
                                {contragents?.map((client) => (
                                    <option key={client.contragentName} value={client.id}>
                                        {client.contragentName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputGroup>
                                <Input
                                    value={
                                        selectedRow?.createdAt
                                            ? new Date(selectedRow?.createdAt)
                                                  .toISOString()
                                                  .split('T')[0]
                                            : ''
                                    }
                                    autoComplete='off'
                                    placeholder='Дата *'
                                    type='date'
                                    marginBottom={3}
                                    readOnly
                                    bg='RGB(223, 223, 223)'
                                />
                            </InputGroup>
                        </FormControl>

                        <Box display='flex' gap={5} marginBottom={1}>
                            <Text width='50%'>Название товара</Text>
                            <Text width='25%'>Количество</Text>
                            <Text width='25%'>Цена</Text>
                        </Box>
                        {fields.map((_, index) => {
                            return (
                                <Box display='flex' gap='1rem' alignItems='center' key={index}>
                                    <Select
                                        width='50%'
                                        {...register(`products.${index}.productId`, {
                                            required: 'Поле является обязательным',
                                        })}
                                        variant='filled'
                                        placeholder='Вид хлеба'
                                        disabled
                                    >
                                        {products?.map((product) => (
                                            <option key={product.name} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </Select>
                                    <Input
                                        width='25%'
                                        {...register(`products.${index}.quantity`, {
                                            required: 'Поле является обязательным',
                                        })}
                                        placeholder='Количество'
                                        disabled
                                        backgroundColor='#edf2f7'
                                    />
                                    <InputNumber
                                        {...register(`products.${index}.price`, {
                                            required: 'Поле является обязательным',
                                        })}
                                        placeholder='Количество'
                                    />
                                </Box>
                            )
                        })}
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
                                value='Редактировать'
                            />
                        </Box>
                    </form>
                </ModalBody>

                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditModal
