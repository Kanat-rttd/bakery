import { Box, Button, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { useApi } from '@/utils/services/axios'
import DateRange from '../../../components/DateRange'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { useNotify } from '@/utils/hooks/useNotify.ts'

type ReconciliationType = {
    reportData: {
        adjustedDate: Date
        ClientName: string
        Sales: number
        Returns: number
        Overhead: number
        Payments: number
        Credit: number
        Debt: number
    }[]
    totalSales: number
    totalReturns: number
    totalOverhead: number
    totalPayments: number
    totalCredit: number
    totalDebt: number
}

type FilteredDataType = {
    date: Date
    reportData: ReportType | undefined
}

type ReportType = {
    ClientName: string
    Sales: number
    Returns: number
    Overhead: number
    Payments: number
    Credit: number
    Debt: number
}

const ReconciliationView = () => {
    const { error } = useNotify()
    const { getURLs, getParam } = useURLParameters()
    const { data: reconciliationViewData } = useApi<ReconciliationType>(
        `reports/generalReconciliation?${getURLs().toString()}`,
    )
    const [filteredData, setFilteredData] = useState<FilteredDataType[]>([])

    const [dates, setDates] = useState<Date[]>([])

    const getUniqDates = () => {
        const uniqDates = new Set<Date>()
        reconciliationViewData?.reportData.forEach((item) => {
            uniqDates.add(item.adjustedDate)
        })
        return [...uniqDates]
    }

    useEffect(() => {
        setDates(getUniqDates())
    }, [reconciliationViewData])

    const groupedData: FilteredDataType[] = dates.map((date) => {
        const filteredReports = reconciliationViewData?.reportData.filter(
            (item) => item.adjustedDate === date,
        )
        const groupedReport: ReportType | undefined = filteredReports?.reduce(
            (acc, item) => {
                acc.Sales += item.Sales
                acc.Returns += item.Returns
                acc.Overhead += Number(item.Overhead)
                acc.Payments += Number(item.Payments)
                acc.Credit += Number(item.Credit)
                acc.Debt += Number(item.Debt)
                return acc
            },
            {
                ClientName: '',
                Sales: 0,
                Returns: 0,
                Overhead: 0,
                Payments: 0,
                Credit: 0,
                Debt: 0,
            },
        )
        return { date: new Date(date), reportData: groupedReport }
    })

    const getFilteredData = () => {
        return groupedData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }

    useEffect(() => {
        setFilteredData(getFilteredData())
    }, [dates])

    const exportExcel = async () => {
        if (filteredData?.length === 0 || !filteredData) {
            return error('Нет данных для экспорта')
        }

        const headers = [
            '№',
            'Дата',
            'Продажи',
            'Возврат',
            'Перевод долга',
            'Выплата',
            'Сверху',
            'Долг',
        ]

        const formattedData = filteredData.map((item, index) => [
            index + 1,
            new Date(item.date).toLocaleDateString(),
            item.reportData?.Sales || 0,
            item.reportData?.Returns || 0,
            item.reportData?.Credit || 0,
            item.reportData?.Payments || 0,
            item.reportData?.Overhead || 0,
            item.reportData?.Debt || 0,
        ])

        console.log(formattedData)

        const startDate = new Date(getParam('startDate')).toLocaleDateString()
        const endDate = new Date(getParam('endDate')).toLocaleDateString()

        await generateExcel(`Акт сверки общий с ${startDate} по ${endDate}`, [
            headers,
            ...formattedData,
            [
                '',
                'ИТОГО',
                reconciliationViewData?.totalSales,
                reconciliationViewData?.totalReturns,
                reconciliationViewData?.totalCredit,
                reconciliationViewData?.totalPayments,
                reconciliationViewData?.totalOverhead,
                reconciliationViewData?.totalDebt,
            ],
        ])
    }

    return (
        <Box>
            <Box width='100%' height='100%' p={5} mt={1}>
                <Box
                    className='print-hidden'
                    marginBottom={6}
                    display='flex'
                    justifyContent='space-between'
                >
                    <Box display='flex' gap='15px' width='100%'>
                        <DateRange />
                    </Box>

                    <Box display='flex' gap='15px'>
                        <Button type='button' onClick={exportExcel}>
                            Экспорт в Excel
                        </Button>
                        <Button type='button' onClick={() => window.print()}>
                            Экспорт в PDF
                        </Button>
                    </Box>
                </Box>
                <Box>
                    <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>№</Th>
                                    <Th>Дата</Th>
                                    <Th>Продажи</Th>
                                    <Th>Возврат</Th>
                                    <Th>Перевод долга</Th>
                                    <Th>Выплата</Th>
                                    <Th>Сверху</Th>
                                    <Th>Долг</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredData?.length ? (
                                    filteredData.map((item, index) => (
                                        <Tr key={index}>
                                            <Td>{index + 1}</Td>
                                            <Td>{dayjs(item.date).format('DD.MM.YYYY')}</Td>
                                            <Td>{(item.reportData?.Sales || 0).formatted()}</Td>
                                            <Td>{(item.reportData?.Returns || 0).formatted()}</Td>
                                            <Td>{(item.reportData?.Credit || 0).formatted()}</Td>
                                            <Td>{(item.reportData?.Payments || 0).formatted()}</Td>
                                            <Td>{(item.reportData?.Overhead || 0).formatted()}</Td>
                                            <Td>{(item.reportData?.Debt || 0).formatted()}</Td>
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
                                    <Th fontSize={15} color='#000'>
                                        {reconciliationViewData?.totalSales.formatted()}
                                    </Th>
                                    <Th fontSize={15} color='#000'>
                                        {reconciliationViewData?.totalReturns.formatted()}
                                    </Th>
                                    <Th fontSize={15} color='#000'>
                                        {reconciliationViewData?.totalCredit.formatted()}
                                    </Th>
                                    <Th fontSize={15} color='#000'>
                                        {reconciliationViewData?.totalPayments.formatted()}
                                    </Th>
                                    <Th fontSize={15} color='#000'>
                                        {reconciliationViewData?.totalOverhead.formatted()}
                                    </Th>
                                    <Th fontSize={15} color='#000'>
                                        {reconciliationViewData?.totalDebt.formatted()}
                                    </Th>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    )
}

export default ReconciliationView
