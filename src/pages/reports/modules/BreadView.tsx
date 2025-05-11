import { useEffect, useState } from 'react'
import { Box, Button, Select, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { useApi } from '@/utils/services/axios'
import DateRange from '../../../components/DateRange'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import dayjs from 'dayjs'
import { useNotify } from '@/utils/hooks/useNotify.ts'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'

interface BreadViewData {
    reportData: ReportDataType[]
    totals: { name: string; totalQuantity: number }[]
}

type ReportDataType = {
    contragentName: string
    name: string
    adjustedDate: Date
    SalesQuantity: number
}

interface Client {
    id: string
    name: string
    surname: string
    contact: string
    telegrammId: string
    status: string
}

type FilteredData = {
    date: string
    products: {
        productName: string
        totalQuantity: number
    }[]
}

const BreadView = () => {
    const { error } = useNotify()
    const { getURLs, setParam, getParam } = useURLParameters()
    const { data: breadViewData } = useApi<BreadViewData>(`reports/sales?${getURLs().toString()}`)
    const { data: clientsData } = useApi<Client[]>('client')
    const [productsNames, setProductsNames] = useState<string[]>([])
    const [dates, setDates] = useState<Date[]>([])
    const [filteredProducts, setFilteredProducts] = useState<FilteredData[] | undefined>([])

    const getUniqDates = () => {
        const uniqDates = new Set<Date>()
        breadViewData?.reportData?.forEach((item) => {
            uniqDates.add(item.adjustedDate)
        })
        return [...uniqDates]
    }

    const getProductsNames = () => {
        const productNames = new Set<string>()
        breadViewData?.reportData?.forEach((entry) => {
            productNames.add(entry.name)
        })
        return [...productNames]
    }

    const getFilteredProducts = (): FilteredData[] => {
        if (!breadViewData?.reportData) return []

        const groupedData: { [date: string]: { productName: string; totalQuantity: number }[] } = {}

        breadViewData.reportData.forEach((entry) => {
            const dateKey = dayjs(entry.adjustedDate).format('DD.MM.YYYY')
            if (!groupedData[dateKey]) {
                groupedData[dateKey] = []
            }
            const existingProductIndex = groupedData[dateKey].findIndex(
                (productEntry) => productEntry.productName === entry.name,
            )
            if (existingProductIndex === -1) {
                groupedData[dateKey].push({
                    productName: entry.name,
                    totalQuantity: Number(entry.SalesQuantity),
                })
            } else {
                groupedData[dateKey][existingProductIndex].totalQuantity += Number(
                    entry.SalesQuantity,
                )
            }
        })

        return Object.keys(groupedData).map((date) => ({
            date,
            products: groupedData[date],
        }))
    }

    const exportExcel = async () => {
        if (filteredProducts?.length === 0 || !filteredProducts) {
            return error('Нет данных для экспорта')
        }

        const headers = ['№', 'Дата', ...productsNames.map((name) => name)]

        const formattedData = filteredProducts.map((entry, idx) => {
            const numbers = headers
                .slice(2)
                .map(
                    (header) =>
                        entry.products.find(({ productName }) => productName === header)
                            ?.totalQuantity ?? 0,
                )

            return [idx + 1, entry.date, ...numbers]
        })

        const total = productsNames.map(
            (productName) =>
                breadViewData?.totals.find((item) => item.name === productName)?.totalQuantity ?? 0,
        )

        const startDate = new Date(getParam('startDate')).toLocaleDateString()
        const endDate = new Date(getParam('endDate')).toLocaleDateString()

        await generateExcel(`Отчет по продукции с ${startDate} по ${endDate}`, [
            headers,
            ...formattedData,
            ['', 'ИТОГО', ...total],
        ])
    }

    useEffect(() => {
        setDates(getUniqDates())
        setProductsNames(getProductsNames())
    }, [breadViewData])

    useEffect(() => {
        setFilteredProducts(getFilteredProducts())
    }, [productsNames, dates])

    return (
        <Box as='main' width='100%' height='100%' p={5} mt={1}>
            <Box marginBottom={6} display='flex' justifyContent='space-between'>
                <Box display='flex' gap='15px' width='100%'>
                    <DateRange />
                    <Select
                        className='print-hidden'
                        size='sm'
                        borderRadius={5}
                        width='fit-content'
                        value={getParam('contragentName')}
                        onChange={(e) => setParam('contragentName', e.target.value)}
                    >
                        <option value=''>Все клиенты</option>
                        {clientsData?.map((client) => (
                            <option key={client.id} value={client.name}>
                                {client.name}
                            </option>
                        ))}
                    </Select>
                </Box>
                <Box className='print-hidden' display='flex' gap='15px'>
                    <Button type='button' onClick={exportExcel}>
                        Экспорт в Excel
                    </Button>
                    <Button type='button' onClick={() => window.print()}>
                        Экспорт в PDF
                    </Button>
                </Box>
            </Box>
            <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>№</Th>
                            <Th>Дата</Th>
                            {productsNames.map((product, index) => (
                                <Th key={index}>{product}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredProducts?.length ? (
                            filteredProducts?.map((entry, index) => (
                                <Tr key={index}>
                                    <Td>{index + 1}</Td>
                                    <Td>{entry.date}</Td>
                                    {productsNames.map((name, productIndex) => (
                                        <Td key={productIndex}>
                                            {entry.products.find(
                                                (prod) => prod.productName === name,
                                            )?.totalQuantity || 0}
                                        </Td>
                                    ))}
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td>Нет данных</Td>
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th fontSize={15} color='#000'>
                                ИТОГО
                            </Th>
                            <Th></Th>
                            {productsNames.map((productName, index) => {
                                const total = breadViewData?.totals.find(
                                    (item) => item.name === productName,
                                )?.totalQuantity
                                return (
                                    <Th key={index} fontSize={15} color='#000'>
                                        {total}
                                    </Th>
                                )
                            })}
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default BreadView
