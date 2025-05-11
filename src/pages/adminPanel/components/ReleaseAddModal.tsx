import { useEffect } from 'react'
import { createClient, updateClient } from '@/utils/services/client.service'
// import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import {
    Button,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    FormControl,
    FormErrorMessage,
} from '@chakra-ui/react'
import PasswordInput from '@/components/shared/PasswordInput'
import PhoneInput from '@/components/shared/PhoneInput'
import StatusSelect from '@/components/shared/StatusSelect'
import { ReleaserType } from '@/utils/types/releaser.types'
import InputNumber from '@/components/shared/NumberInput'
import { useNotify } from '@/utils/hooks/useNotify'

interface ReleaseAddModalProps {
    data: ReleaserType | undefined
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const ReleaseAddModal: React.FC<ReleaseAddModalProps> = ({ data, isOpen, onClose, onSuccess }) => {
    const { success, error } = useNotify()

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        setValue,
        getValues,
        formState: { errors },
        reset,
    } = useForm<ReleaserType>()

    const sendData = (formData: ReleaserType) => {
        const responsePromise: Promise<any> = data
            ? updateClient(data.id, { ...formData, status: Number(formData.status) ? true : false })
            : createClient({ ...formData, status: Number(formData.status) ? true : false })
        responsePromise
            .then((res) => {
                reset()
                onSuccess()
                handleClose()
                success(res.data.message)
            })
            .catch((err: any) => {
                console.log(err.response)
                error(err.response.data.message || 'Ошибка')
            })
    }

    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                setValue(key as keyof ReleaserType, value)
            })
            setValue('status', data.status ? '1' : '0')
        } else {
            reset()
        }
    }, [data, isOpen, reset])

    const handleClose = () => {
        onClose()
        reset()
    }

    return (
        <Modal isCentered isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
            <ModalContent>
                <ModalHeader>{data ? 'Редактировать' : 'Добавить'} реализатора</ModalHeader>
                <ModalCloseButton />
                <ModalBody display='flex' flexDirection='column' gap={3}>
                    <FormControl isInvalid={!!errors.name}>
                        <InputGroup>
                            <Input
                                {...register('name', {
                                    required: 'Поле является обязательным',
                                })}
                                autoComplete='off'
                                placeholder='Имя *'
                                type='text'
                            />
                        </InputGroup>
                        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.surname}>
                        <InputGroup>
                            <Input
                                {...register('surname', {
                                    required: 'Поле является обязательным',
                                })}
                                autoComplete='off'
                                placeholder='Фамилия *'
                                type='text'
                            />
                        </InputGroup>
                        <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.contact}>
                        <Controller
                            name='contact'
                            control={control}
                            rules={{
                                required: 'Поле является обязательным',
                                minLength: {
                                    value: 10,
                                    message: 'Некорректный номер телефона.',
                                },
                                maxLength: {
                                    value: 10,
                                    message: 'Некорректный номер телефона.',
                                },
                            }}
                            render={({ field }) => {
                                const { onChange, value } = field
                                return (
                                    <PhoneInput
                                        value={value}
                                        onChange={(val: string) => {
                                            if (val.length <= 10) {
                                                onChange(val)
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                        <FormErrorMessage>{errors.contact?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.telegrammId}>
                        <InputGroup>
                            <InputNumber
                                {...register('telegrammId', {
                                    required: 'Поле является обязательным',
                                    maxLength: {
                                        value: 20,
                                        message: 'Некорректный Телеграм ID',
                                    },
                                    pattern: {
                                        value: /^\d+$/,
                                        message:
                                            'Некорректный Телеграм ID. Используйте только цифры',
                                    },
                                })}
                                placeholder='Телеграм ID *'
                            />
                        </InputGroup>
                        <FormErrorMessage>{errors.telegrammId?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.status}>
                        <StatusSelect
                            {...register('status', {
                                required: 'Поле является обязательным',
                            })}
                        />
                        <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                        <PasswordInput
                            {...register('password', {
                                required: data ? false : 'Поле является обязательным',
                            })}
                            placeholder='Пароль *'
                        />
                        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.checkPassword}>
                        <PasswordInput
                            {...register('checkPassword', {
                                required: data ? false : 'Поле является обязательным',
                                validate: (value) =>
                                    value === getValues('password') || 'Пароли должны совпадать',
                            })}
                            placeholder='Подтвердите пароль *'
                        />
                        <FormErrorMessage>{errors.checkPassword?.message}</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <ModalFooter display='flex' alignSelf='center' gap={5}>
                    <Button colorScheme='purple' onClick={handleSubmitForm(sendData)}>
                        {data ? 'Редактировать' : 'Добавить'}
                    </Button>
                    <Button onClick={handleClose}>Закрыть</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ReleaseAddModal
