import DateRange from '@/components/DateRange'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import { Box, Select, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useEffect, useMemo } from 'react'

type ReportData = {
    fullReports: {
        adjustedDate: string
        sales: number
        returns: number
        overhead: number
        payments: number
        magazines: { [x: string]: number }[]
        debt: number
    }[]
    allMagazines: string[]
}

interface Contragent {
    id: number
    contragentName: string
    contragentTypeId: number
}

export default function ReconciliationView() {
    const { getURLs, getParam, setParam } = useURLParameters()

    const { data: contragents } = useApi<Contragent[]>('contragent')
    const { data } = useApi<ReportData>(`reports/reconciliation?${getURLs().toString()}`)
    const total = useMemo(
        () =>
            data?.fullReports.reduce(
                (acc, cur) => {
                    acc.sales += cur.sales
                    acc.returns += cur.returns
                    acc.payments += cur.payments
                    acc.debt += cur.debt

                    return acc
                },
                { sales: 0, returns: 0, payments: 0, debt: 0 },
            ),
        [data],
    )

    useEffect(() => {
        if (!getParam('contragentId')) {
            setParam('contragentId', contragents?.[0].id.toString()!)
        }
    })

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
                        <Select
                            className='print-hidden'
                            size='sm'
                            borderRadius={5}
                            width='fit-content'
                            value={getParam('contragentId')}
                            onChange={(e) => setParam('contragentId', e.target.value)}
                        >
                            {contragents
                                ?.filter((c) => c.contragentTypeId === 1)
                                .map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.contragentName}
                                    </option>
                                ))}
                        </Select>
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
                                    <Th>Выплата</Th>
                                    <Th>Сверху</Th>
                                    {data?.allMagazines.map((item) => <Th key={item}>{item}</Th>)}
                                    <Th>Долг</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.fullReports?.length ? (
                                    data.fullReports.map((item, index) => (
                                        <Tr key={item.adjustedDate}>
                                            <Td>{index + 1}</Td>
                                            <Td>{dayjs(item.adjustedDate).format('DD.MM.YYYY')}</Td>
                                            <Td>{(item.sales || 0).formatted()}</Td>
                                            <Td>{(item.returns || 0).formatted()}</Td>
                                            <Td>{(item.payments || 0).formatted()}</Td>
                                            <Td>{(item.overhead || 0).formatted()}</Td>
                                            {data.allMagazines.map((am) => (
                                                // @ts-ignore
                                                <Td key={am}>{item.magazines[am]}</Td>
                                            ))}
                                            <Td>{(item.debt || 0).formatted()}</Td>
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
                                    <Th />
                                    <Th fontSize={15} color='#000'>
                                        {total?.sales}
                                    </Th>
                                    <Th fontSize={15} color='#000'>
                                        {total?.returns}
                                    </Th>
                                    <Th fontSize={15} color='#000'>
                                        {total?.payments}
                                    </Th>
                                    <Th />
                                    {data?.allMagazines.map(() => <Th />)}
                                    <Th fontSize={15} color='#000'>
                                        {total?.debt}
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

