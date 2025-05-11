import { TableContainer, Tfoot, Thead } from '@/components/ui'
import { Box, Button, Select, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { useApi } from '@/utils/services/axios'
import { useState } from 'react'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { useNotify } from '@/utils/hooks/useNotify.ts'

interface MagazineDebtView {
    mainData: [
        {
            MagazineName: string
            Debit: string
        },
    ]
    total: number
}

interface MagazineData {
    id: number
    name: string
    clientId: number
    status: string
}

const MagazineTable = () => {
    const [filters, setFilters] = useState({ MagazineName: '' })
    const { error } = useNotify()

    const { data: magazineDebtData } = useApi<MagazineDebtView>('reports/magazineDebt', filters)
    const { data: magazinesData } = useApi<MagazineData[]>('magazines')

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }))
    }

    const exportExcel = async () => {
        if (!magazineDebtData?.mainData) {
            return error('Нет данных для экспорта')
        }

        const headers = ['№', 'Магазин', 'Сумма долга']
        const data = [headers]

        magazineDebtData?.mainData
            .filter((item) => Number(item.Debit) !== 0)
            .forEach((item, idx) => {
                data.push([(idx + 1).toString(), item.MagazineName, item.Debit.toString()])
            })

        data.push(['ИТОГО', '', magazineDebtData.total.toString()])

        await generateExcel('Учет долгов (Магазины)', data)
    }

    return (
        <>
            <Box className='print-hidden' display='flex' marginBottom={4} gap='15px'>
                <Select
                    name='MagazineName'
                    placeholder='Магазин'
                    onChange={handleSelectChange}
                    size='sm'
                    borderRadius={5}
                    width='20%'
                >
                    {magazinesData?.map((item, index) => (
                        <option key={index} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </Select>
                <Button type='button' onClick={exportExcel}>
                    Экспорт в Excel
                </Button>
                <Button type='button' onClick={() => window.print()}>
                    Экспорт в PDF
                </Button>
            </Box>
            <Box
                style={
                    magazineDebtData?.mainData && magazineDebtData?.mainData.length >= 8
                        ? { height: '100dvh' }
                        : {}
                }
            >
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>№</Th>
                                <Th>Магазин</Th>
                                <Th>Сумма долга</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {magazineDebtData?.mainData.length ? (
                                magazineDebtData?.mainData
                                    .filter((item) => Number(item.Debit) !== 0)
                                    .map((item, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>{item.MagazineName}</Td>
                                                <Td>{Number(item.Debit).formatted()}</Td>
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
                            <Tr>
                                <Th color='#000' fontSize={15}>
                                    ИТОГО
                                </Th>
                                <Th width='60%'> </Th>
                                <Th color='#000' fontSize={15}>
                                    {magazineDebtData?.total.formatted()}
                                </Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default MagazineTable
