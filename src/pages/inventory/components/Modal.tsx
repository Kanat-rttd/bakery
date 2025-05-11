import { useApi } from '@/utils/services/axios'
import { ProviderGoodsType } from '@/utils/types/providerGoog.types'
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
    InputRightAddon,
    Box,
    Textarea,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { createAdjustment } from '@/utils/services/adjustment.service'
import { useState } from 'react'
import { AddIcon, MinusIcon } from '@chakra-ui/icons'
import InputNumber from '@/components/shared/NumberInput'
import { useNotify } from '@/utils/hooks/useNotify'

type EditModalProps = {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

type EditModalInputs = {
    qty: string
    Comment: string
    item: ProviderGoodsType
}

type GoodsCategoryType = {
    id: number
    category: string
    unitOfMeasure: string
}

const CorrectModal = ({ isOpen, onClose }: EditModalProps) => {
    const { success, error } = useNotify()
    const { data: goodsCategoriesData } = useApi<GoodsCategoryType[]>('goodsCategories')
    const [selectedValue, setSelectedValue] = useState<GoodsCategoryType | null>()
    const [isMinus, setIsMinus] = useState<boolean>(false)

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        reset,
    } = useForm<EditModalInputs>()

    const sendData = (formData: EditModalInputs) => {
        const data = {
            ...formData,
            qty: isMinus ? Number(formData.qty) * -1 : Number(formData.qty),
        }
        const responsePromise: Promise<any> = createAdjustment(data)
        responsePromise
            .then((res) => {
                reset()
                // onSuccess()
                handleClose()
                success(res.data.message)
            })
            .catch(() => {
                error('Произошла ошибка')
            })
    }

    const handleClose = () => {
        reset()
        onClose()
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Добавить корректировки</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display='flex' flexDirection='column' gap={3}>
                            <FormControl isInvalid={!!errors.item}>
                                <Controller
                                    name='item'
                                    control={control}
                                    rules={{ required: 'Поле является обязательным' }}
                                    render={({ field }) => {
                                        const { onChange, value } = field
                                        return (
                                            <Select
                                                options={goodsCategoriesData || []}
                                                getOptionLabel={(option) => option.category}
                                                getOptionValue={(option) => `${option.id}`}
                                                value={goodsCategoriesData?.find(
                                                    (option) => option.id == value?.id,
                                                )}
                                                onChange={(val) => {
                                                    onChange(val)
                                                    setSelectedValue(val)
                                                }}
                                                placeholder='Товар *'
                                                isClearable
                                                isSearchable
                                            />
                                        )
                                    }}
                                />
                                <FormErrorMessage>{errors.item?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.qty}>
                                <InputGroup>
                                    <Button mr={2} onClick={() => setIsMinus(!isMinus)}>
                                        {isMinus ? <MinusIcon width={3} /> : <AddIcon width={3} />}
                                    </Button>
                                    <InputNumber
                                        {...register('qty', {
                                            required: 'Поле является обязательным',
                                        })}
                                        placeholder='Количество *'
                                    />
                                    <InputRightAddon>
                                        {selectedValue ? selectedValue.unitOfMeasure : 'кг'}
                                    </InputRightAddon>
                                </InputGroup>
                                <FormErrorMessage>{errors.qty?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl>
                                <Textarea
                                    placeholder='Комментарий'
                                    maxLength={50}
                                    size='sm'
                                    {...register('Comment')}
                                    resize='none'
                                />
                            </FormControl>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Отмена
                        </Button>
                        <Button colorScheme='purple' onClick={handleSubmitForm(sendData)}>
                            Отправить
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default CorrectModal
