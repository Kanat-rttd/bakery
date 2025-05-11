import {
    Box,
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
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { useApi } from '@/utils/services/axios'
import { useEffect, useState } from 'react'
import { createProviderGoods, updateProviderGoods } from '@/utils/services/providerGoods.service'
import { ProviderInputs } from '@/utils/types/providerGoog.types'
import StatusSelect from '@/components/shared/StatusSelect'
import { ProviderType } from '@/utils/types/provider.types'
import { useNotify } from '@/utils/hooks/useNotify'

interface ProviderGoods {
    id: number
    providerId: number
    goodsCategoryId: number
    unitOfMeasure: string
    goods: string
    place: { label: string }[]
    status: string
    provider: {
        id: number
        name: string
    }
}

interface Place {
    label: string
}

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    selectedData: ProviderGoods | undefined
    onSuccess: () => void
}

type GoodsCategoryType = {
    id: number
    category: string
    unitOfMeasure: string
}

const GoodsAddModal = ({ isOpen, onClose, selectedData, onSuccess }: ModalProps) => {
    const { success, error } = useNotify()
    const { data: providersData } = useApi<ProviderType[]>('providers?status=1')
    const { data: goodsCategories } = useApi<GoodsCategoryType[]>('goodsCategories')
    const { data: placesData } = useApi<Place[]>('place')
    const [selectedCategory, setSelectedCateory] = useState<GoodsCategoryType | null>(null)

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        setValue,
        reset,
    } = useForm<ProviderInputs>()

    useEffect(() => {
        if (selectedData) {
            Object.entries(selectedData).forEach(([key, value]) => {
                setValue(key as keyof ProviderInputs, value)
            })
            setValue('bakery', JSON.parse(String(selectedData.place)))
            setValue('status', selectedData.status ? '1' : '0')
        } else {
            reset()
        }
    }, [selectedData, isOpen, reset])

    const sendData = (formData: ProviderInputs) => {
        const responsePromise: Promise<any> = selectedData
            ? updateProviderGoods(selectedData.id, {
                  ...formData,
                  unitOfMeasure: selectedCategory?.unitOfMeasure,
                  status: Number(formData.status) ? true : false,
              })
            : createProviderGoods({
                  ...formData,
                  unitOfMeasure: selectedCategory?.unitOfMeasure,
                  status: Number(formData.status) ? true : false,
              })

        responsePromise
            .then((res) => {
                reset()
                onSuccess()
                handleClose()
                success(res.data.message)
            })
            .catch((err) => {
                error(err.response.data.error)
            })
    }

    const handleClose = () => {
        onClose()
        reset()
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    onClose()
                    reset()
                }}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{selectedData ? 'Редактировать' : 'Добавить'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display='flex' flexDirection='column' gap={3}>
                            <form
                                onSubmit={handleSubmitForm(sendData)}
                                style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                            >
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
                                                        (option) =>
                                                            String(option.id) == String(value),
                                                    )}
                                                    onChange={(
                                                        selectedOption: ProviderType | null,
                                                    ) => {
                                                        onChange(selectedOption?.id)
                                                    }}
                                                    placeholder='Выберите поставщика *'
                                                    isClearable
                                                    isSearchable
                                                />
                                            )
                                        }}
                                    />
                                    <FormErrorMessage>
                                        {errors.providerId?.message}
                                    </FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.goodsCategoryId}>
                                    <Controller
                                        name='goodsCategoryId'
                                        control={control}
                                        rules={{ required: 'Поле является обязательным' }}
                                        render={({ field }) => {
                                            const { onChange, value } = field
                                            return (
                                                <Select
                                                    options={goodsCategories}
                                                    getOptionLabel={(option: GoodsCategoryType) =>
                                                        option.category
                                                    }
                                                    getOptionValue={(option: GoodsCategoryType) =>
                                                        `${option.id}`
                                                    }
                                                    value={goodsCategories?.filter(
                                                        (option) =>
                                                            String(option.id) == String(value),
                                                    )}
                                                    onChange={(
                                                        selectedOption: GoodsCategoryType | null,
                                                    ) => {
                                                        onChange(selectedOption?.id)
                                                        setSelectedCateory(selectedOption)
                                                    }}
                                                    placeholder='Выберите категорию товара *'
                                                    isClearable
                                                    isSearchable
                                                />
                                            )
                                        }}
                                    />
                                    <FormErrorMessage>{errors.bakery?.message}</FormErrorMessage>
                                </FormControl>
                                <FormControl isInvalid={!!errors.goods}>
                                    <Input
                                        maxLength={20}
                                        {...register('goods', {
                                            required: 'Поле является обязательным',
                                        })}
                                        autoComplete='off'
                                        placeholder='Товар *'
                                        type='text'
                                    />
                                    <FormErrorMessage>{errors.goods?.message}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={!!errors.bakery}>
                                    <Controller
                                        name='bakery'
                                        control={control}
                                        rules={{ required: 'Поле является обязательным' }}
                                        render={({ field }) => {
                                            const { onChange, value } = field
                                            return (
                                                <Select
                                                    isMulti
                                                    options={placesData?.map((bakeryItem) => ({
                                                        value: bakeryItem.label,
                                                        label: bakeryItem.label,
                                                    }))}
                                                    value={(value || []).map((val) => ({
                                                        value: val.label,
                                                        label: val.label,
                                                    }))}
                                                    onChange={(val) => onChange(val)}
                                                    placeholder='Выберите место *'
                                                    isClearable
                                                    isSearchable
                                                />
                                            )
                                        }}
                                    />
                                    <FormErrorMessage>{errors.bakery?.message}</FormErrorMessage>
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
                                        value={selectedData ? 'Редактировать' : 'Добавить'}
                                    />
                                </Box>
                            </form>
                        </Box>
                    </ModalBody>

                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GoodsAddModal
