import {
    Box,
    Button,
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
} from '@chakra-ui/react'
import { useEffect } from 'react'
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from '@choc-ui/chakra-autocomplete'

import { createDispatch, updateDispatchQuantity } from '@/utils/services/dispatch.service'
import { useNotify } from '@/utils/hooks/useNotify'
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { mutate, useApi } from '@/utils/services/axios'
import { DispatchType } from '@/utils/types/dispatch.types'
import { CloseIcon } from '@chakra-ui/icons'
import { Product } from '@/utils/types/product.types'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { ContragentCategoryType, ContragentType } from '@/utils/types/contragent.types'
import InputNumber from '@/components/shared/NumberInput'

interface DistributionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    status: string
    data?: DispatchType
}

type FormType = {
    contragentId: number
    products: {
        productId: number | null
        quantity: number | null
    }[]
}

const DistributionModal: React.FC<DistributionModalProps> = ({
    data,
    isOpen,
    onClose,
    onSuccess,
    status,
}) => {
    const { getURLs } = useURLParameters()
    const { loading } = useNotify()
    const { data: contragentsTypesData } = useApi<ContragentCategoryType[]>('contragentType')
    const { data: clientsData } = useApi<ContragentType[]>(
        `contragent?type=${
            contragentsTypesData?.find((item) => item.type === 'реализатор')?.id
        }&status=1`,
    )
    const { data: products } = useApi<Product[]>('product?status=1')

    const {
        register,
        reset,
        setValue,
        control,
        setError,
        formState: { errors },
        handleSubmit: handleSubmitForm,
    } = useForm<FormType>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'products',
    })

    useEffect(() => {
        if (data?.goodsDispatchDetails) {
            const _data = data.goodsDispatchDetails.map((order) => ({
                productId: Number(order.productId),
                quantity: Number(order.quantity),
            }))
            setValue('contragentId', Number(data.contragentId))
            setValue('products', _data)
        } else {
            reset()
        }
    }, [data, reset, setValue])

    const handleConfirm: SubmitHandler<FormType> = (formData) => {
        try {
            const createData = {
                contragentId: formData.contragentId,
                products: formData.products.map((product) => ({
                    productId: product.productId !== undefined ? product.productId : null,
                    quantity: Number(product.quantity),
                    productPrice: products?.find((item) => item.id == product.productId)?.price,
                })),

                dispatch: status,
            }
            const updateData = {
                contragentId: formData.contragentId,
                products: formData.products.map((product) => ({
                    productId: product.productId,
                    quantity: Number(product.quantity),
                    price:
                        data?.goodsDispatchDetails.find((item) => item.id == product.productId)
                            ?.price ??
                        products?.find((item) => item.id == product.productId)?.price,
                })),
                dispatch: status,
            }

            const responsePromise: Promise<any> = data
                ? updateDispatchQuantity(data.id, updateData)
                : createDispatch(createData)
            loading(responsePromise)
            responsePromise.then(() => {
                reset()
                onClose()
                onSuccess()
                mutate(`release?${getURLs().toString()}&status=${status}`)
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
                <ModalHeader>{status == '0' ? 'Выдача' : 'Возврат'} продукции</ModalHeader>
                <ModalCloseButton />
                <ModalBody display='flex' gap='10px' flexDirection='column'>
                    <form
                        onSubmit={handleSubmitForm(handleConfirm)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                    >
                        <FormControl id='type' isRequired isInvalid={!!errors.contragentId}>
                            <Controller
                                name='contragentId'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field: { value, onChange, name } }) => {
                                    const inputValue = value
                                        ? clientsData?.find((i) => i.id == value)?.contragentName
                                        : ''

                                    return (
                                        <AutoComplete
                                            rollNavigation
                                            freeSolo
                                            value={inputValue}
                                            onChange={onChange}
                                        >
                                            {({ isOpen, onClose, onOpen }) => (
                                                <>
                                                    <AutoCompleteInput
                                                        autoComplete='off'
                                                        name={name}
                                                        placeholder='Выберите получателя'
                                                        onClick={onOpen}
                                                    />
                                                    <AutoCompleteList
                                                        visibility={isOpen ? 'visible' : 'hidden'}
                                                    >
                                                        {clientsData?.map((client) => {
                                                            return (
                                                                <AutoCompleteItem
                                                                    key={client.id}
                                                                    value={Number(client.id)}
                                                                    label={client.contragentName}
                                                                    onSelect={() => onClose()}
                                                                >
                                                                    {client.contragentName}
                                                                </AutoCompleteItem>
                                                            )
                                                        })}
                                                    </AutoCompleteList>
                                                </>
                                            )}
                                        </AutoComplete>
                                    )
                                }}
                            />

                            <FormErrorMessage>{errors.contragentId?.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isRequired gap='1rem' display='flex' flexDirection='column'>
                            {fields.map((_, index) => {
                                return (
                                    <Box display='flex' gap='1rem' alignItems='center' key={index}>
                                        <Controller
                                            name={`products.${index}.productId`}
                                            control={control}
                                            rules={{ required: 'Поле является обязательным' }}
                                            render={({ field }) => {
                                                const { onChange, value } = field
                                                const selectedProductId =
                                                    value !== null ? String(value) : ''

                                                return (
                                                    <Select
                                                        value={selectedProductId}
                                                        onChange={(selectedOption) => {
                                                            onChange(selectedOption)
                                                        }}
                                                        variant='filled'
                                                        placeholder='Выберите продукт'
                                                    >
                                                        {products
                                                            ?.filter((item) => {
                                                                const products = fields.filter(
                                                                    (_, i) => index > i,
                                                                )
                                                                return !products.find(
                                                                    (product) =>
                                                                        product.productId ==
                                                                        item.id,
                                                                )
                                                            })
                                                            .map((product) => (
                                                                <option
                                                                    key={product.name}
                                                                    value={product.id}
                                                                >
                                                                    {product.name}
                                                                </option>
                                                            ))}
                                                    </Select>
                                                )
                                            }}
                                        />
                                        <InputNumber
                                            {...register(`products.${index}.quantity`, {
                                                required: 'Поле является обязательным',
                                            })}
                                            placeholder='Количество'
                                        />
                                        {fields.length > 1 && (
                                            <CloseIcon
                                                cursor='pointer'
                                                onClick={() => remove(index)}
                                            />
                                        )}
                                    </Box>
                                )
                            })}
                            <Button
                                onClick={() => {
                                    append({ productId: null, quantity: null })
                                }}
                            >
                                Добавить
                            </Button>
                            <FormErrorMessage>{errors.products?.root?.message}</FormErrorMessage>
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
                                value='Подтвердить'
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
