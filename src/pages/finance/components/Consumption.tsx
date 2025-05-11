import { ArrivalInputs } from '@/utils/types/finance.types'
import { Box, Button, FormControl, FormErrorMessage, Input, Textarea } from '@chakra-ui/react'
import Select from 'react-select'
import { Controller, useForm } from 'react-hook-form'
import { createConsumption } from '@/utils/services/finance.service'
import { ContragentType } from '@/utils/types/contragent.types'
import { useApi } from '@/utils/services/axios'
import InputNumber from '@/components/shared/NumberInput'
import { useEffect, useState } from 'react'
import { useNotify } from '@/utils/hooks/useNotify'

interface Category {
    id: number
    name: string
    type: string
    contragentTypeId: number
}

interface Account {
    id: number
    name: string
}

const formatOptionLabel = (option: ContragentType) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{option.contragentName}</span>
        <span style={{ marginLeft: '50px', color: '#bfbdbd' }}> {option.contragentType.type}</span>
    </div>
)

type ArrivalProps = {
    categoriesData: Category[] | undefined
}

const Consumption = ({ categoriesData }: ArrivalProps) => {
    const { loading } = useNotify()

    const { data: accounts } = useApi<Account[]>('financeAccount')
    const { data: contragentsData } = useApi<ContragentType[]>('contragent?status=1')
    const [filteredFinanceCategories, setFilteredFinanceCategories] = useState<Category[]>([])
    const [filteredContragents, setFilteredContragents] = useState<ContragentType[]>([])

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        setValue,
        getValues,
        formState: { errors },
        reset,
        watch,
    } = useForm<ArrivalInputs>()

    const sendData = (formData: ArrivalInputs) => {
        const responsePromise: Promise<any> = createConsumption(formData)
        loading(responsePromise)
        responsePromise
            .then(() => {
                reset()
                setValue('amount', null)
                setValue('comment', '')
            })
            .catch((error) => {
                console.error('Error creating sale:', error)
            })
    }

    useEffect(() => {
        const values = getValues()

        if (!contragentsData || !categoriesData) return

        if (values.financeCategoryId !== null) {
            const contragentType = categoriesData.find(
                (item) => item.id === Number(values.financeCategoryId),
            )?.contragentTypeId
            const filteredContragents = contragentsData.filter(
                (item) => item.contragentTypeId === contragentType,
            )
            setFilteredContragents(filteredContragents)
        }

        if (values.contragentId !== null) {
            const contragentType = contragentsData.find(
                (item) => item.id === Number(values.contragentId),
            )?.contragentTypeId
            const filteredFinanceCategories = categoriesData.filter(
                (item) => item.contragentTypeId === contragentType,
            )
            setFilteredFinanceCategories(filteredFinanceCategories)
        }
    }, [watch('financeCategoryId'), watch('contragentId')])

    useEffect(() => {
        if (contragentsData) {
            setFilteredContragents(contragentsData)
        }
    }, [contragentsData])

    return (
        <>
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
                    defaultValue={new Date().toISOString().split('T')[0]}
                    placeholder='Дата'
                    type='date'
                />
            </FormControl>

            <FormControl hidden isInvalid={!!errors.financeAccountId}>
                <Controller
                    defaultValue={1}
                    name='financeAccountId'
                    control={control}
                    rules={{ required: 'Поле является обязательным' }}
                    render={({ field }) => {
                        const { onChange, value } = field
                        return (
                            <Select
                                options={accounts}
                                getOptionLabel={(option: Account) => option.name}
                                getOptionValue={(option: Account) => `${option.name}`}
                                value={accounts?.filter((option) => Number(option.id) == value)}
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
                                options={
                                    filteredFinanceCategories.length
                                        ? filteredFinanceCategories
                                        : categoriesData
                                }
                                getOptionLabel={(option: Category) => option.name}
                                getOptionValue={(option: Category) => `${option.id}`}
                                value={categoriesData?.filter((option) => option.id == value)}
                                onChange={(selectedOption: Category | null) => {
                                    onChange(selectedOption?.id)
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

            <FormControl isInvalid={!!errors.contragentId}>
                <Controller
                    name='contragentId'
                    control={control}
                    rules={{
                        required: {
                            message: 'Поле является обязательным',
                            value: watch('financeCategoryId') !== 8,
                        },
                    }}
                    render={({ field }) => {
                        const { onChange, value } = field
                        return (
                            <Select
                                required={watch('financeCategoryId') !== 8}
                                options={
                                    filteredContragents.length
                                        ? filteredContragents
                                        : contragentsData
                                }
                                getOptionLabel={(option: ContragentType) =>
                                    `${option.contragentName} - ${option.contragentType.type}`
                                }
                                getOptionValue={(option: ContragentType) => `${option.id}`}
                                value={contragentsData?.filter((option) => option.id == value)}
                                onChange={(selectedOption: ContragentType | null) => {
                                    onChange(selectedOption?.id)
                                }}
                                placeholder='Контрагент *'
                                formatOptionLabel={formatOptionLabel}
                                isClearable
                                isSearchable
                            />
                        )
                    }}
                />
                <FormErrorMessage>{errors.contragentId?.message}</FormErrorMessage>
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

            <Box style={{ width: '100%', textAlign: 'center' }}>
                <Button
                    // isLoading={isLoading}
                    style={{ background: '#29647C', color: '#fff' }}
                    onClick={handleSubmitForm(sendData)}
                >
                    Отправить
                </Button>
            </Box>
        </>
    )
}

export default Consumption
