import { Box, Button, FormControl, FormErrorMessage, Input, Textarea } from '@chakra-ui/react'
import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { TransferInputs } from '@/utils/types/finance.types'
import { createTransfer } from '@/utils/services/finance.service'
import { useApi } from '@/utils/services/axios'
import InputNumber from '@/components/shared/NumberInput'
import { useNotify } from '@/utils/hooks/useNotify'

interface Account {
    id: number
    name: string
}

const Transfer = () => {
    const { loading } = useNotify()
    const { data: accounts } = useApi<Account[]>('financeAccount')
    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm<TransferInputs>()

    const sendData = (formData: TransferInputs) => {
        const responsePromise: Promise<any> = createTransfer(formData)
        loading(responsePromise)
        responsePromise
            .then(() => {
                reset()
                setValue('amount', null)
                setValue('comment', '')
            })
            .catch((error) => {
                console.error('Error creating transfer:', error)
            })
    }

    return (
        <Box display='flex' flexDirection='column' gap={4}>
            <FormControl isInvalid={!!errors.amount}>
                <InputNumber
                    maxLength={20}
                    {...register('amount', {
                        required: 'Поле является обязательным',
                    })}
                    placeholder='Сумма *'
                />
                <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>

            <FormControl>
                <Input
                    {...register('date', { required: 'Поле является обязательным' })}
                    autoComplete='off'
                    defaultValue={new Date().toISOString().split('T')[0]}
                    placeholder='Дата *'
                    type='date'
                />
            </FormControl>

            <FormControl isInvalid={!!errors.fromAccountId}>
                <Controller
                    name='fromAccountId'
                    control={control}
                    rules={{ required: 'Поле является обязательным' }}
                    render={({ field }) => {
                        const { onChange, value } = field
                        return (
                            <Select
                                options={accounts}
                                getOptionValue={(option: Account) => `${option.id}`}
                                getOptionLabel={(option: Account) => option.name}
                                value={accounts?.filter((option) => Number(option.id) == value)}
                                onChange={(selectedOption: Account | null) => {
                                    if (selectedOption) {
                                        onChange(selectedOption.id)
                                    }
                                }}
                                placeholder='Со счета*'
                                isClearable
                                isSearchable
                            />
                        )
                    }}
                />
                <FormErrorMessage>{errors.fromAccountId?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.toAccountId}>
                <Controller
                    name='toAccountId'
                    control={control}
                    rules={{ required: 'Поле является обязательным' }}
                    render={({ field }) => {
                        const { onChange, value } = field
                        return (
                            <Select
                                options={accounts}
                                getOptionValue={(option: Account) => `${option.id}`}
                                getOptionLabel={(option: Account) => option.name}
                                value={accounts?.filter((option) => Number(option.id) == value)}
                                onChange={(selectedOption: Account | null) => {
                                    if (selectedOption) {
                                        onChange(selectedOption.id)
                                    }
                                }}
                                placeholder='На счет*'
                                isClearable
                                isSearchable
                            />
                        )
                    }}
                />
                <FormErrorMessage>{errors.toAccountId?.message}</FormErrorMessage>
            </FormControl>

            <Textarea
                placeholder='Комментарий'
                maxLength={50}
                size='sm'
                {...register('comment')}
                resize='none'
            />

            <Box style={{ width: '100%', textAlign: 'center' }}>
                <Button
                    onClick={handleSubmitForm(sendData)}
                    style={{ background: '#29647C', color: '#fff' }}
                >
                    Отправить
                </Button>
            </Box>
        </Box>
    )
}

export default Transfer
