import Dialog from '@/components/Dialog'
import { ChevronDownIcon, ChevronUpIcon, CloseIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Select,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Tr,
    useDisclosure,
} from '@chakra-ui/react'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import DateRange from '../../../components/DateRange'
import IsMobile from '@/utils/helpers/isMobile'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { mutate, useApi } from '@/utils/services/axios'
import { TableContainer, Thead, Tfoot } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useNotify } from '@/utils/hooks/useNotify.ts'
import { deleteFinance } from '@/utils/services/finance.service.ts'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { Search2Icon } from '@chakra-ui/icons'

export type History = {
    id: number
    date: Date
    account: string
    amount: string
    financeCategory: {
        id: number
        name: string
        type: string
    }
    financeCategoryId: number
}

interface Finance {
    id: number
    amount: string
    date: Date
    financeCategory: {
        id: number
        name: string
        type: string
    }
    contragent?: {
        id: number
        contragentName: string
    }
    financeCategoryId: number
    account: string
    comment: string
}

interface Category {
    id: number
    name: string
    type: string
}

const History = () => {
    const { success, error } = useNotify()
    const { getURLs, setParam, getParam } = useURLParameters()
    const [sortOrder, setSortOrder] = useState('asc')
    const [isHovered, setIsHovered] = useState(false)
    const [searchValue, setSearchValue] = useState<string>(getParam('search'))

    const { data: financeData } = useApi<Finance[]>(`finance?${getURLs().toString()}`)
    const { data: categoriesData } = useApi<Category[] | undefined>(`financeCategories`)

    const [selectedData, setSelectedData] = useState<History | null>(null)
    const [data, setData] = useState<Finance[] | undefined>(undefined)
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        if (searchValue) {
            const timeout = setTimeout(() => {
                setParam('search', searchValue)
            }, 500)

            return () => {
                clearTimeout(timeout)
            }
        } else {
            setParam('search', searchValue)
        }
    }, [searchValue])

    useEffect(() => {
        if (financeData) {
            setData(financeData)
        }
    }, [financeData])

    const sortData = (order: string) => {
        const sorted = financeData?.slice().sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)

            if (order === 'asc') {
                return dateA.getTime() - dateB.getTime()
            } else {
                return dateB.getTime() - dateA.getTime()
            }
        })

        setSortOrder(order)
        setData(sorted)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    const handleDelete = (transaction: History) => {
        onOpen()
        setSelectedData(transaction)
    }

    const handleDeleteConfirm = async () => {
        if (selectedData) {
            deleteFinance(selectedData.id)
                .then((res: any) => {
                    mutate(`finance?${getURLs().toString()}`)
                    success(res.data.message)
                })
                .catch((err: any) => {
                    error(err.response.data.error)
                })
        }
    }

    const exportExcel = async () => {
        if (data?.length === 0 || !data) {
            return error('Нет данных для экспорта')
        }

        const headers = ['№', 'Дата', 'Контрагент', 'Категория', 'Комментарий', 'Сумма']

        const formattedData = data.map((item, idx) => [
            idx + 1,
            new Date(item.date).toLocaleDateString(),
            item.contragent?.contragentName ?? '',
            item.financeCategory.name,
            item.comment,
            item.amount,
        ])

        const totals = [
            'ИТОГО',
            '',
            '',
            '',
            '',
            data?.reduce((acc, item) => {
                return acc + Number(item.amount)
            }, 0),
        ]

        const startDate = dayjs(getParam('startDate') || new Date()).format('DD.MM.YYYY')
        const endDate = dayjs(getParam('endDate') || new Date()).format('DD.MM.YYYY')

        await generateExcel(`История финансов с ${startDate} по ${endDate}`, [
            headers,
            ...formattedData,
            totals,
        ])
    }

    return (
        <>
            <Box display='flex' flexDirection='column' gap='1rem' padding={IsMobile() ? 0 : 5}>
                <Box display='flex' justifyContent='space-between'>
                    <Box display='flex' gap='15px'>
                        <DateRange />
                        <Select
                            className='print-hidden'
                            placeholder='Все категории'
                            width='90%'
                            size='sm'
                            borderRadius={5}
                            value={getParam('categoryId')}
                            onChange={(e) => setParam('categoryId', e.target.value)}
                        >
                            {categoriesData?.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </Box>
                    <Box className='print-hidden' display='flex' gap='15px'>
                        <InputGroup w='400px'>
                            <InputLeftElement pointerEvents='none' children={<Search2Icon />} />
                            <Input
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder='Поиск по комментариям, контрагентам'
                                _placeholder={{
                                    fontSize: '15px',
                                }}
                            />
                            <InputRightElement
                                onClick={() => setSearchValue('')}
                                pointerEvents={'fill'}
                                children={<CloseIcon boxSize={3} />}
                            />
                        </InputGroup>
                        <Button type='button' onClick={exportExcel}>
                            Экспорт в Excel
                        </Button>
                        <Button type='button' onClick={window.print}>
                            Экспорт в PDF
                        </Button>
                    </Box>
                </Box>

                <UniversalComponent>
                    <TableContainer overflowY='auto'>
                        <Table variant='simple'>
                            <Thead>
                                <Tr position='sticky' top={0} backgroundColor='white' zIndex={9}>
                                    <Th textAlign='center'>№</Th>
                                    <Th
                                        display='flex'
                                        cursor='pointer'
                                        color={isHovered ? '#ccc' : 'black'}
                                        alignItems='center'
                                        transition='color 0.2s'
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        onClick={() =>
                                            sortData(sortOrder === 'asc' ? 'desc' : 'asc')
                                        }
                                    >
                                        Дата
                                        {sortOrder === 'asc' ? (
                                            <ChevronDownIcon boxSize={6} />
                                        ) : (
                                            <ChevronUpIcon boxSize={6} />
                                        )}
                                    </Th>
                                    <Th>Контрагент</Th>
                                    <Th>Категория</Th>
                                    <Th>Комментарий</Th>
                                    <Th>Сумма</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.length ? (
                                    data?.map((transaction, index) => (
                                        <Tr
                                            key={transaction.id}
                                            onClick={() => handleDelete(transaction)}
                                        >
                                            <Td textAlign='center'>{index + 1}</Td>
                                            <Td>{dayjs(transaction.date).format('DD.MM.YYYY')}</Td>
                                            <Td>{transaction.contragent?.contragentName ?? ''}</Td>
                                            <Td>{transaction.financeCategory.name}</Td>
                                            <Td>{transaction.comment}</Td>
                                            <Td>{Number(transaction.amount).formatted()}</Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td>Нет данных</Td>
                                        <Td></Td>
                                        <Td></Td>
                                        <Td></Td>
                                    </Tr>
                                )}
                            </Tbody>
                            <Tfoot>
                                <Tr>
                                    <Th fontSize={15} color='#000' textAlign='center'>
                                        ИТОГО
                                    </Th>
                                    <Th></Th>
                                    <Th></Th>
                                    <Th></Th>
                                    <Th></Th>
                                    <Th fontSize={15} color='#000'>
                                        {data
                                            ?.reduce((acc, item) => {
                                                return acc + Number(item.amount)
                                            }, 0)
                                            .formatted()}
                                    </Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </UniversalComponent>

                <Dialog
                    isOpen={isOpen}
                    onClose={onClose}
                    header='Удалить запись?'
                    body={
                        <>
                            <Text>
                                <strong>Дата:</strong>{' '}
                                {dayjs(selectedData?.date).format('DD.MM.YYYY')}
                            </Text>
                            <Text>
                                <strong>Сумма:</strong> {selectedData?.amount}
                            </Text>
                            <Text>
                                <strong>Категория:</strong> {selectedData?.financeCategory.name}
                            </Text>
                        </>
                    }
                    actionBtn={handleDeleteConfirm}
                    actionText='Удалить'
                />
            </Box>
        </>
    )
}

export default History
