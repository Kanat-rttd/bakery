import { ArrivalInputs } from '@/utils/types/finance.types'
import { Box, Button, FormControl, FormErrorMessage, Input, Textarea, Text } from '@chakra-ui/react'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { createInvoiceArrival } from '@/utils/services/finance.service'
import useSWR, { mutate } from 'swr'
import { getAllClients } from '@/utils/services/client.service'
import { getAllFinancesCategories } from '@/utils/services/financeCategories.service'
import { useApi } from '@/utils/services/axios'
import InputNumber from '@/components/shared/NumberInput'

const account = [
    {
        id: 1,
        name: 'Счёт 1',
    },
    {
        id: 2,
        name: 'Счёт 2',
    },
]

interface Category {
    id: number
    name: string
    type: string
}

interface totalAmount {
    totalAmount: number
}

interface Account {
    id: number
    name: string
}

interface Client {
    id: number
    name: string
    surname: string
    contact: string
    telegrammId: string
    status: number
}

interface ArrivalFormProps {
    invoiceNumber?: number
    totalSumm?: number
}

const Arrival: React.FC<ArrivalFormProps> = ({ invoiceNumber, totalSumm }) => {
    const { data: financeData } = useApi<totalAmount>(`finance/${invoiceNumber}`)

    const { data: clientsData } = useSWR<Client[]>(['client'], {
        fetcher: () => getAllClients({ name: '', telegrammId: '', status: '' }),
    })

    const { data: categoriesData } = useSWR<Category[]>(['financeCategories'], {
        fetcher: () => getAllFinancesCategories(),
    })

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        reset,
    } = useForm<ArrivalInputs>()

    const sendData = (formData: ArrivalInputs) => {
        createInvoiceArrival(invoiceNumber, formData)
            .then(() => {
                mutate(`finance/${invoiceNumber}`)
                mutate('finance/totals')
                mutate('release/invoice')
                reset()
            })
            .catch((error) => {
                console.error('Error creating sale:', error)
            })
    }

    return (
        <>
            <Box height='100%' display='flex' flexDirection='column'>
                <Box display='flex' flexDirection='column' gap='15px' flex={1}>
                    <FormControl isInvalid={!!errors.amount}>
                        <InputNumber
                            maxLength={20}
                            {...register('amount', { required: 'Поле является обязательным' })}
                            placeholder='Сумма *'
                        />
                        <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl variant='floating' isInvalid={!!errors.date}>
                        <Input
                            {...register('date', { required: 'Поле является обязательным' })}
                            autoComplete='off'
                            placeholder='Дата'
                            type='date'
                        />
                    </FormControl>

                    <FormControl isInvalid={!!errors.financeAccountId}>
                        <Controller
                            name='financeAccountId'
                            control={control}
                            rules={{ required: 'Поле является обязательным' }}
                            render={({ field }) => {
                                const { onChange, value } = field
                                return (
                                    <Select
                                        options={account}
                                        getOptionLabel={(option: Account) => option.name}
                                        getOptionValue={(option: Account) => `${option.name}`}
                                        value={account?.filter((option) => option.id == value)}
                                        // onChange={(val: Account) => onChange(val?.name)}
                                        onChange={(selectedOption: Account | null) => {
                                            if (selectedOption) {
                                                onChange(selectedOption.id)
                                            }
                                        }}
                                        placeholder='Выберите счет *'
                                        isClearable
                                        isSearchable
                                    />
                                )
                            }}
                        />
                        <FormErrorMessage>{errors.financeAccountId?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.financeCategoryId}>
                        <Controller
                            name='financeCategoryId'
                            control={control}
                            rules={{ required: 'Поле является обязательным' }}
                            render={({ field }) => {
                                const { onChange, value } = field
                                return (
                                    <Select
                                        options={categoriesData}
                                        getOptionLabel={(option: Category) => option.name}
                                        getOptionValue={(option: Category) => `${option.id}`}
                                        value={categoriesData?.filter(
                                            (option) => option.id == value,
                                        )}
                                        // onChange={(val: Category) => onChange(val?.id)}
                                        onChange={(selectedOption: Category | null) => {
                                            if (selectedOption) {
                                                onChange(selectedOption.id)
                                            }
                                        }}
                                        placeholder='Категория *'
                                        isClearable
                                        isSearchable
                                    />
                                )
                            }}
                        />
                        <FormErrorMessage>{errors.financeCategoryId?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.clientId}>
                        <Controller
                            name='clientId'
                            control={control}
                            rules={{ required: 'Поле является обязательным' }}
                            render={({ field }) => {
                                const { onChange, value } = field
                                return (
                                    <Select
                                        options={clientsData}
                                        getOptionLabel={(option: Client) => option.name}
                                        getOptionValue={(option: Client) => `${option.id}`}
                                        value={clientsData?.filter((option) => option.id == value)}
                                        // onChange={(val: Client) => onChange(val?.id)}
                                        onChange={(selectedOption: Client | null) => {
                                            if (selectedOption) {
                                                onChange(selectedOption.id)
                                            }
                                        }}
                                        placeholder='Контрагент *'
                                        isClearable
                                        isSearchable
                                    />
                                )
                            }}
                        />
                        <FormErrorMessage>{errors.clientId?.message}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                        <Textarea
                            placeholder='Комментарий'
                            maxLength={50}
                            size='sm'
                            {...register('comment')}
                            resize='none'
                        />
                    </FormControl>
                </Box>
                <Box style={{ width: '100%', textAlign: 'center', textAlignLast: 'right' }}>
                    <Button colorScheme='blue' mr={3}>
                        Закрыть
                    </Button>
                    <Button
                        style={{ background: '#29647C', color: '#fff' }}
                        onClick={handleSubmitForm(sendData)}
                    >
                        Отправить
                    </Button>
                </Box>
                <Box>
                    <Text color='RGB(149, 147, 147)'>
                        Остаток суммы {Number(totalSumm) - Number(financeData?.totalAmount)} тг
                    </Text>
                </Box>
            </Box>
        </>
    )
}

export default Arrival
