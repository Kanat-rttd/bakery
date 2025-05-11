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
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import StatusSelect from '@/components/shared/StatusSelect'
import { createProvider, updateProvider } from '@/utils/services/provider.service'
import { ProviderForm, ProviderType } from '@/utils/types/provider.types'
import { useNotify } from '@/utils/hooks/useNotify'

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    selectedData: ProviderType | undefined
    onSuccess: () => void
}

const ProviderAddModal = ({ isOpen, onClose, selectedData, onSuccess }: ModalProps) => {
    const { success, error } = useNotify()

    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        setValue,
        reset,
    } = useForm<ProviderForm>()

    useEffect(() => {
        if (selectedData) {
            Object.entries(selectedData).forEach(([key, value]) => {
                setValue(key as keyof ProviderForm, value as string)
            })
            setValue('status', selectedData.status ? '1' : '0')
        } else {
            reset()
        }
    }, [selectedData, isOpen, reset])

    const sendData = (formData: ProviderForm) => {
        const responsePromise: Promise<{ data: { message: string } }> = selectedData
            ? updateProvider(selectedData.id, {
                  ...formData,
                  status: !!Number(formData.status),
              })
            : createProvider({ ...formData, status: !!Number(formData.status) })

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
                                <FormControl isInvalid={!!errors.providerName}>
                                    <Input
                                        maxLength={50}
                                        {...register('providerName', {
                                            required: 'Поле является обязательным',
                                        })}
                                        autoComplete='off'
                                        placeholder='Наименование *'
                                        type='text'
                                    />
                                    <FormErrorMessage>
                                        {errors.providerName?.message}
                                    </FormErrorMessage>
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

export default ProviderAddModal
