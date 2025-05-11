import {
    Box,
    Divider,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Textarea,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useForm, Controller } from 'react-hook-form'
import { createDebtTransfer } from '@/utils/services/debtTransfer.service'
import { useApi } from '@/utils/services/axios'
import classes from '../index.module.css'
import { ContragentCategoryType, ContragentType } from '@/utils/types/contragent.types'
import { MagazineType } from '@/utils/types/magazine.type'
import { useNotify } from '@/utils/hooks/useNotify'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import InputNumber from '@/components/shared/NumberInput'

interface DebtTransferInputs {
    from: number
    to: number
    summa: string
    date: Date
    invoiceNumber: number
    comment: string
}

const formatOptionLabel = (option: ContragentType) => (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{option.contragentName}</span>
        <span style={{ marginLeft: '50px', color: '#bfbdbd' }}> {option.contragentType.type}</span>
    </div>
)

const DebtTransferForm = () => {
    const { loading } = useNotify()
    const { setParam } = useURLParameters()
    const [selectedProvider, setSelectedProvider] = useState<ContragentType | null>(null)

    const { data: magazinesData } = useApi<MagazineType[]>('magazines?status=1')
    const { data: contragentsTypesData } = useApi<ContragentCategoryType[]>('contragentType')
    const { data: contragentsMagazinesData } = useApi<ContragentType[]>(
        `contragent?status=1&type=${
            contragentsTypesData?.find((item) => item.type === 'магазин')?.id
        }`,
    )
    const { data: clientsData } = useApi<ContragentType[]>(
        `contragent?status=1&type=${
            contragentsTypesData?.find((item) => item.type === 'реализатор')?.id
        }`,
    )

    const [contragents, setContragents] = useState<ContragentType[]>([])
    const [filteredContragents, setFilteredContragents] = useState<ContragentType[] | undefined>([])

    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        reset,
    } = useForm<DebtTransferInputs>()

    useEffect(() => {
        if (clientsData && contragentsMagazinesData) {
            setContragents([...clientsData, ...contragentsMagazinesData])
        }
    }, [clientsData, contragentsMagazinesData])

    useEffect(() => {
        setFilteredContragents(getFilteredContragents())
    }, [selectedProvider])

    const sendData = (formData: DebtTransferInputs) => {
        const responsePromise: Promise<any> = createDebtTransfer(formData)
        loading(responsePromise)
        responsePromise
            .then(() => {
                reset()
            })
            .catch((error) => {
                console.error('Error creating sale:', error)
            })
        setParam('contragentId', '')
    }

    const getFilteredContragents = () => {
        if (magazinesData == undefined) {
            return
        }

        if (
            selectedProvider?.contragentType.type == 'реализатор' &&
            contragentsMagazinesData != undefined
        ) {
            const magazinesIds = magazinesData
                .filter((magazine) => magazine.clientId == selectedProvider.mainId)
                .map((magazine) => magazine.id)
            const contragents: ContragentType[] = contragentsMagazinesData.filter((contragent) =>
                magazinesIds.includes(contragent.mainId),
            )
            setParam('contragentId', selectedProvider.id.toString())
            return contragents
        } else if (selectedProvider?.contragentType.type == 'магазин' && clientsData != undefined) {
            const clientIds = magazinesData
                .filter((magazine) => magazine.id == selectedProvider.mainId)
                .map((magazine) => magazine.clientId)
            const contragents: ContragentType[] = clientsData.filter((client) =>
                clientIds.includes(client.mainId),
            )
            setParam('contragentId', contragents[0].id.toString())
            return contragents
        }
    }

    return (
        <>
            <Box height='100%' display='flex' flexDirection='column' alignItems='center'>
                <Box
                    width='50%'
                    display='flex'
                    flexDirection='column'
                    gap='15px'
                    flex={1}
                    border='1px solid gray'
                    p={5}
                    borderRadius={5}
                >
                    <Heading size='md' textAlign='center'>
                        Перевод долга
                    </Heading>
                    <Divider></Divider>
                    <form
                        onSubmit={handleSubmitForm(sendData)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                    >
                        <FormControl
                            isInvalid={!!errors.from}
                            isRequired
                            display='flex'
                            width='100%'
                        >
                            <FormLabel width='13%'>От:</FormLabel>
                            <Controller
                                name='from'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={contragents}
                                            getOptionLabel={(option: ContragentType) =>
                                                `${option.contragentName} - ${option.contragentType.type}`
                                            }
                                            getOptionValue={(option: ContragentType) =>
                                                `${option.id}`
                                            }
                                            value={contragents?.filter(
                                                (option) => String(option.id) == String(value),
                                            )}
                                            onChange={(selectedOption: ContragentType | null) => {
                                                onChange(selectedOption?.id)
                                                setSelectedProvider(selectedOption)
                                            }}
                                            placeholder=''
                                            isClearable
                                            isSearchable
                                            className={classes.select}
                                            formatOptionLabel={formatOptionLabel}
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.from?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.to} isRequired display='flex' width='100%'>
                            <FormLabel width='13%'>Кому:</FormLabel>
                            <Controller
                                name='to'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={filteredContragents}
                                            getOptionLabel={(option: ContragentType) =>
                                                `${option.contragentName} - ${option.contragentType}`
                                            }
                                            getOptionValue={(option: ContragentType) =>
                                                `${option.id}`
                                            }
                                            value={
                                                value
                                                    ? filteredContragents?.filter(
                                                          (option) => option?.id == value,
                                                      )
                                                    : null
                                            }
                                            onChange={(selectedOption: ContragentType | null) => {
                                                onChange(selectedOption?.id)
                                            }}
                                            placeholder=''
                                            isClearable
                                            isSearchable
                                            className={classes.select}
                                            formatOptionLabel={formatOptionLabel}
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.to?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={!!errors.summa}>
                            <InputNumber
                                maxLength={20}
                                {...register('summa', { required: 'Поле является обязательным' })}
                                placeholder='Сумма *'
                            />
                            <FormErrorMessage>{errors.summa?.message}</FormErrorMessage>
                        </FormControl>

                        <FormControl variant='floating' isInvalid={!!errors.date}>
                            <Input
                                {...register('date', { required: 'Поле является обязательным' })}
                                autoComplete='off'
                                placeholder='Дата'
                                defaultValue={new Date().toISOString().split('T')[0]}
                                type='date'
                            />
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
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: '10px',
                            }}
                        >
                            <Input
                                width='40%'
                                type='submit'
                                bg='purple.500'
                                color='white'
                                cursor='pointer'
                                value='Подтвердить'
                            />
                        </Box>
                    </form>
                </Box>
            </Box>
        </>
    )
}

export default DebtTransferForm
