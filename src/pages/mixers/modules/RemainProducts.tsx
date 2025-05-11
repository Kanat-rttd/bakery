import { Table, Tr, Th, Tbody, Td, Box, Select, Button } from '@chakra-ui/react'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import DateRange from '@/components/DateRange'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useApi } from '@/utils/services/axios'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { useNotify } from '@/utils/hooks/useNotify.ts'

type RemainProducts = {
    id: number // ID
    name: string // Name
    production: number // Выпечка
    distribution: string // Выдача
    returns: string // Возврат
    openingStock: number // ОстатокНаНачало
    productionPeriod: number // ВыпечкаПериод
    distributionPeriod: string // ВыдачаПериод
    defect: number // Брак
    returnsPeriod: string // ВозвратПериод
    closingStock: number // ОстатокНаКонец
}[]

type Totals = {
    production: number
    distribution: number
    returns: number
    openingStock: number
    productionPeriod: number
    distributionPeriod: number
    defect: number
    returnsPeriod: number
    closingStock: number
}

type RemProducts = {
    data: RemainProducts
    totals: Totals
}

const RemainProducts = () => {
    const { getURLs, getParam } = useURLParameters()
    const { error } = useNotify()
    const { data: remainProducts } = useApi<RemProducts>(
        `reports/remainProducts?${getURLs().toString()}`,
    )

    const exportExcel = async () => {
        if (!remainProducts || remainProducts?.data.length === 0) {
            return error('Нет данных для экспорта')
        }

        const headers = [
            '№',
            'Название',
            'Остаток на начало',
            'Выпечка',
            'Продажи',
            'Брак',
            'Возврат',
            'Остаток на конец',
        ]

        const formattedData = remainProducts.data.map((item, idx) => [
            idx + 1,
            item.name,
            item.openingStock,
            item.productionPeriod,
            item.distributionPeriod,
            item.defect,
            item.returnsPeriod,
            item.closingStock,
        ])

        const totals = [
            '',
            'ИТОГО',
            remainProducts.totals.openingStock,
            remainProducts.totals.productionPeriod,
            remainProducts.totals.distributionPeriod,
            remainProducts.totals.defect,
            remainProducts.totals.returnsPeriod,
            remainProducts.totals.closingStock,
        ]

        const startDate = new Date(getParam('startDate')).toLocaleDateString()
        const endDate = new Date(getParam('endDate')).toLocaleDateString()

        await generateExcel(`Остаток продукции с ${startDate} по ${endDate}`, [
            headers,
            ...formattedData,
            totals,
        ])
    }

    return (
        <UniversalComponent>
            <Box display='flex' flexDirection='column' p={5} mt={1}>
                <Box marginBottom={5} display='flex' justifyContent='space-between'>
                    <Box display='flex' gap='15px' width='fit-content'>
                        <DateRange />
                        <Select
                            className='print-hidden'
                            size='sm'
                            borderRadius={5}
                            placeholder='Название'
                            width='fit-content'
                            name='status'
                        >
                            <option value='1'>Активен</option>
                            <option value='0'>Приостановлен</option>
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
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>№</Th>
                                <Th>Название</Th>
                                <Th>Остаток на начало</Th>
                                <Th>Выпечка</Th>
                                <Th>Продажи</Th>
                                <Th>Брак</Th>
                                <Th>Возврат</Th>
                                <Th>Остаток на конец</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {remainProducts?.data?.length ? (
                                remainProducts.data?.map((product, index) => {
                                    return (
                                        <Tr key={index + 1}>
                                            <Td>{index + 1}</Td>
                                            <Td>{product.name}</Td>
                                            <Td>{product.openingStock}</Td>
                                            <Td>{product.productionPeriod}</Td>
                                            <Td>{product.distributionPeriod}</Td>
                                            <Td>{product.defect}</Td>
                                            <Td>{product.returnsPeriod}</Td>
                                            <Td>{product.closingStock - product.defect}</Td>
                                        </Tr>
                                    )
                                })
                            ) : (
                                <Tr>
                                    <Td>Нет данных</Td>
                                </Tr>
                            )}
                        </Tbody>
                        <Tfoot>
                            <Tr color='#000' fontSize={15} fontWeight='bold'>
                                <Td>Итого</Td>
                                <Td></Td>
                                <Td>{remainProducts?.totals?.openingStock}</Td>
                                <Td>{remainProducts?.totals?.productionPeriod}</Td>
                                <Td>{remainProducts?.totals?.distributionPeriod}</Td>
                                <Td>{remainProducts?.totals?.defect}</Td>
                                <Td>{remainProducts?.totals?.returnsPeriod}</Td>
                                <Td>
                                    {(remainProducts?.totals?.closingStock || 0) -
                                        (remainProducts?.totals.defect || 0)}
                                </Td>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
        </UniversalComponent>
    )
}

export default RemainProducts
