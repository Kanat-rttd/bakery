import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalOverlay,
    Input,
    FormControl,
    FormErrorMessage,
    Box,
} from '@chakra-ui/react'

import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { createUser, updateUser } from '../../../utils/services/user.service'
import PhoneInput from '@/components/shared/PhoneInput'
import { User } from '@/utils/types/user.types'
import PasswordInput from '@/components/shared/PasswordInput'
import StatusSelect from '@/components/shared/StatusSelect'
import InputNumber from '@/components/shared/NumberInput'
import { useNotify } from '@/utils/hooks/useNotify'

interface UserAddModalProps {
    data: User | undefined
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const UserAddModal = ({ data, isOpen, onClose, onSuccess }: UserAddModalProps) => {
    const { success, error } = useNotify()

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        getValues,
        setValue,
        formState: { errors },
        reset,
    } = useForm<User>()

    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                setValue(key as keyof User, value)
            })
            setValue('permission', JSON.parse(String(data.permission)))
            setValue('status', data.status ? '1' : '0')
        } else {
            reset()
        }
    }, [data, isOpen, reset])

    const sendData = (formData: User) => {
        const responsePromise: Promise<any> = data
            ? updateUser(data.id, { ...formData, status: Number(formData.status) ? true : false })
            : createUser({ ...formData, status: Number(formData.status) ? true : false })

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

    const permissions = [
        { label: 'Админ' },
        { label: 'Производство' },
        { label: 'Продажи' },
        { label: 'Закуп' },
        { label: 'Финансы' },
        { label: 'Отчеты' },
        { label: 'Инвентаризация' },
    ]

    const handleClose = () => {
        onClose()
        reset()
    }

    return (
        <>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
                <ModalContent>
                    <ModalHeader>{data ? 'Редактировать' : 'Добавить'} адмперсонал</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display='flex' flexDirection='column' gap={3}>
                        <form
                            onSubmit={handleSubmitForm(sendData)}
                            autoComplete='new-password'
                            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            <FormControl isInvalid={!!errors.name}>
                                <Input
                                    {...register('name', {
                                        required: 'Поле является обязательным',
                                    })}
                                    autoComplete='new-password'
                                    placeholder='Имя *'
                                    type='text'
                                />
                                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.surname}>
                                <Input
                                    {...register('surname', {
                                        required: 'Поле является обязательным',
                                    })}
                                    autoComplete='new-password'
                                    placeholder='Фамилия *'
                                    type='text'
                                />
                                <FormErrorMessage>{errors.surname?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.userClass}>
                                <Input
                                    {...register('userClass', {
                                        required: 'Поле является обязательным',
                                    })}
                                    placeholder='Должность *'
                                    autoComplete='new-password'
                                    // id="userClassInput"
                                    // name="userClassInput"
                                    type='text'
                                />
                                <FormErrorMessage>{errors.userClass?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.permission}>
                                <Controller
                                    name='permission'
                                    control={control}
                                    rules={{ required: 'Поле является обязательным' }}
                                    render={({ field }) => {
                                        const { onChange, value } = field
                                        return (
                                            <Select
                                                isMulti
                                                options={permissions.map((permission) => ({
                                                    value: permission.label,
                                                    label: permission.label,
                                                }))}
                                                value={(value || []).map((val) => ({
                                                    value: val.label,
                                                    label: val.label,
                                                }))}
                                                onChange={(val) => onChange(val)}
                                                placeholder='Доступ *'
                                                isClearable
                                                isSearchable
                                            />
                                        )
                                    }}
                                />
                                <FormErrorMessage>{errors.permission?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.phone}>
                                <Controller
                                    name='phone'
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
                                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.fixSalary}>
                                <InputNumber
                                    {...register('fixSalary', {
                                        required: 'Поле является обязательным',
                                        maxLength: {
                                            value: 10,
                                            message: 'Максимальная длина 10 символов',
                                        },
                                    })}
                                    placeholder='Фикс ЗП. *'
                                />
                                <FormErrorMessage>{errors.fixSalary?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.status}>
                                <StatusSelect
                                    {...register('status', {
                                        required: 'Поле является обязательным',
                                    })}
                                />
                                <FormErrorMessage>{errors.status?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.pass}>
                                <PasswordInput
                                    {...register('pass', {
                                        required: data ? false : 'Поле является обязательным',
                                    })}
                                    placeholder='Пароль *'
                                />
                                <FormErrorMessage>{errors.pass?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!errors.checkPass}>
                                <PasswordInput
                                    {...register('checkPass', {
                                        required: data ? false : 'Поле является обязательным',
                                        validate: (value) =>
                                            value === getValues('pass') ||
                                            'Пароли должны совпадать',
                                    })}
                                    placeholder='Подтвердите пароль *'
                                />
                                <FormErrorMessage>{errors.checkPass?.message}</FormErrorMessage>
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

export default UserAddModal
