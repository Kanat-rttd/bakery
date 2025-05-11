import { Table, Tr, Th, Tbody, Td, Box, Select, Button } from '@chakra-ui/react'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useApi } from '@/utils/services/axios'
import DateRange from '@/components/DateRange'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { useNotify } from '@/utils/hooks/useNotify.ts'

type RemainRawMaterials = {
    id: number
    category: string
    unitOfMeasure: string
    openingStock: number
    consumption: number
    incoming: string
    adjustmentPeriod: number
    closingStock: number
}[]

type Totals = {
    openingStock: number
    consumption: number
    incoming: number
    adjustmentPeriod: number
    closingStock: number
}

type Remain = {
    data: RemainRawMaterials
    totals: Totals
}

const RemainRawMaterials = () => {
    const { getURLs, getParam } = useURLParameters()
    const { error } = useNotify()
    const { data: remainRawMaterials } = useApi<Remain>(
        `reports/remainRawMaterials?${getURLs().toString()}`,
    )

    const exportExcel = async () => {
        if (!remainRawMaterials || remainRawMaterials?.data.length === 0) {
            return error('Нет данных для экспорта')
        }

        const headers = [
            '№',
            'Название',
            'Остаток на начало',
            'Расход',
            'Приход',
            'Остаток на конец',
        ]

        const formattedData = remainRawMaterials.data.map((item, idx) => [
            idx + 1,
            item.category,
            item.openingStock,
            item.consumption,
            item.incoming,
            item.closingStock,
        ])

        const totals = [
            '',
            'ИТОГО',
            remainRawMaterials.totals.openingStock,
            remainRawMaterials.totals.consumption,
            remainRawMaterials.totals.incoming,
            remainRawMaterials.totals.closingStock,
        ]

        const startDate = new Date(getParam('startDate')).toLocaleDateString()
        const endDate = new Date(getParam('endDate')).toLocaleDateString()

        await generateExcel(`Остаток сырья с ${startDate} по ${endDate}`, [
            headers,
            ...formattedData,
            totals,
        ])
    }

    return (
        <>
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
                    <TableContainer style={{ width: '100%', overflowY: 'auto' }}>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>№</Th>
                                    <Th>Название</Th>
                                    <Th>Остаток на начало</Th>
                                    <Th>Расход</Th>
                                    <Th>Приход</Th>
                                    <Th>Остаток на конец</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {remainRawMaterials?.data?.length ? (
                                    remainRawMaterials.data?.map((product, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{product.id}</Td>
                                                <Td>{product.category}</Td>
                                                <Td>{product.openingStock}</Td>
                                                <Td>{product.consumption}</Td>
                                                <Td>{product.incoming}</Td>
                                                <Td>{product.closingStock}</Td>
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
                                    <Td>{remainRawMaterials?.totals?.openingStock}</Td>
                                    <Td>{remainRawMaterials?.totals?.consumption}</Td>
                                    <Td>{remainRawMaterials?.totals?.incoming}</Td>
                                    <Td>{remainRawMaterials?.totals?.closingStock}</Td>
                                </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
            </UniversalComponent>
        </>
    )
}

export default RemainRawMaterials
