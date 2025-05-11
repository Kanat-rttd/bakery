import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalOverlay,
    Input,
    Select,
    FormControl,
    FormErrorMessage,
    Box,
} from '@chakra-ui/react'

import { createProduct, updateProduct } from '@/utils/services/product.service'
import { useEffect, useState } from 'react'
import { getAllBakingFacilityUnits } from '@/utils/services/bakingFacilityUnits.service'
import { useForm } from 'react-hook-form'
import { FacilityUnit, Product, ProductForSend } from '@/utils/types/product.types'
import StatusSelect from '@/components/shared/StatusSelect'
import InputNumber from '@/components/shared/NumberInput'

interface ProductAddModalProps {
    data: Product | undefined
    isOpen: boolean
    onClose: () => void
    onAddProduct: () => void
}

const ProductAddModal = ({ data, isOpen, onClose, onAddProduct }: ProductAddModalProps) => {
    const {
        register,
        handleSubmit: handleSubmitForm,
        setValue,
        formState: { errors },
        reset,
    } = useForm<ProductForSend>()

    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                setValue(key as keyof ProductForSend, value)
            })
            setValue('status', data.status ? '1' : '0')
        } else {
            reset()
        }
    }, [data, isOpen, reset])

    const sendData = (formData: ProductForSend) => {
        if (data) {
            updateProduct(data.id, {
                ...formData,
                status: Number(formData.status) ? true : false,
            }).then(() => {
                onAddProduct()
            })
        } else {
            createProduct({ ...formData, status: Number(formData.status) ? true : false }).then(
                () => {
                    onAddProduct()
                },
            )
        }
        handleClose()
        reset()
    }

    const [facilityUnits, setFacilityUnits] = useState<FacilityUnit[] | undefined>()

    useEffect(() => {
        getAllBakingFacilityUnits().then((responseData) => {
            setFacilityUnits(responseData)
        })
    }, [])

    const handleClose = () => {
        onClose()
        reset()
    }

    return (
        <>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>{data ? 'Редактировать' : 'Добавить'} продукт</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form
                            onSubmit={handleSubmitForm(sendData)}
                            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            <FormControl isInvalid={!!errors.name}>
                                <Input
                                    {...register('name', {
                                        required: 'Поле является обязательным',
                                    })}
                                    placeholder='Наименование'
                                />
                                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.bakingFacilityUnitId}>
                                <Select
                                    placeholder='Выберите цех'
                                    defaultValue={data?.bakingFacilityUnit.id}
                                    {...register('bakingFacilityUnitId', {
                                        required: 'Поле является обязательным',
                                    })}
                                >
                                    {facilityUnits?.map((unit, index) => (
                                        <option key={index} value={unit.id}>
                                            {unit.facilityUnit}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>
                                    {errors.bakingFacilityUnitId?.message}
                                </FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.price}>
                                <InputNumber
                                    {...register('price', {
                                        required: 'Поле является обязательным',
                                    })}
                                    placeholder='Цена'
                                />
                                <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.costPrice}>
                                <Input
                                    {...register('costPrice', {
                                        required: 'Поле является обязательным',
                                    })}
                                    type='number'
                                    name='costPrice'
                                    placeholder='Себестоимость'
                                    min='0'
                                    onKeyDown={(e) => {
                                        if (e.key === '-') {
                                            e.preventDefault()
                                        }
                                    }}
                                />
                                <FormErrorMessage>{errors.costPrice?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.status}>
                                <StatusSelect
                                    {...register('status', {
                                        required: 'Поле является обязательным',
                                    })}
                                />
                                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
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
                    </ModalBody>
                    <ModalFooter gap={3}></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProductAddModal
