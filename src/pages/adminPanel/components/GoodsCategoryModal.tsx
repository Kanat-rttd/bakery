import { useNotify } from '@/utils/hooks/useNotify'
import { createGoodsCategory, updateGoodsCategory } from '@/utils/services/goodsCategory.service'
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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type GoodsCategory = {
    id: number
    category: string
    unitOfMeasure: string
    createdAt: Date
}

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    selectedData: GoodsCategory | undefined
    onSuccess: () => void
}

export default function GoodsCategoryModal({
    isOpen,
    onClose,
    onSuccess,
    selectedData,
}: ModalProps) {
    const { success, error } = useNotify()
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        setValue,
        reset,
    } = useForm<GoodsCategory>()

    const sendData = (formData: GoodsCategory) => {
        const responsePromise = selectedData
            ? updateGoodsCategory(selectedData.id, {
                  ...formData,
              })
            : createGoodsCategory(formData)

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

    useEffect(() => {
        if (selectedData) {
            Object.entries(selectedData).forEach(([key, value]) => {
                setValue(key as keyof GoodsCategory, value)
            })
        } else {
            reset()
        }
    }, [selectedData, isOpen, reset])

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
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
                            <FormControl isInvalid={!!errors.category}>
                                <Input
                                    maxLength={20}
                                    {...register('category', {
                                        required: 'Поле является обязательным',
                                    })}
                                    autoComplete='off'
                                    placeholder='Категория *'
                                    type='text'
                                />
                                <FormErrorMessage>{errors.category?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.unitOfMeasure}>
                                <Input
                                    maxLength={20}
                                    {...register('unitOfMeasure', {
                                        required: 'Поле является обязательным',
                                    })}
                                    autoComplete='off'
                                    placeholder='Единица измерения *'
                                    type='text'
                                />
                                <FormErrorMessage>{errors.unitOfMeasure?.message}</FormErrorMessage>
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
    )
}

