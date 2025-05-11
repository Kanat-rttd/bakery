import { Box, Button, Select, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { useApi } from '@/utils/services/axios'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import { useEffect, useState } from 'react'
import { useNotify } from '@/utils/hooks/useNotify.ts'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { ContragentCategoryType, ContragentType } from '@/utils/types/contragent.types.ts'
import { useURLParameters } from '@/utils/hooks/useURLParameters.tsx'

interface CalculationsData {
    Data: {
        client: string
        debt: number
    }[]
    Total: number
}

const ProviderTable = () => {
    const { error } = useNotify()
    const { setParam, getURLs } = useURLParameters()
    const { data: calculationsData } = useApi<CalculationsData>(
        `debtTransfer/calculations?${getURLs().toString()}`,
    )
    const [filteredData, setFilteredData] = useState<CalculationsData['Data']>([])
    const { data: contragentsTypesData } = useApi<ContragentCategoryType[]>('contragentType')
    const { data: clientsData } = useApi<ContragentType[]>(
        `contragent?status=1&type=${
            contragentsTypesData?.find((item) => item.type === 'реализатор')?.id
        }`,
    )

    const exportExcel = async () => {
        if (!filteredData || filteredData.length === 0) {
            return error('Нет данных для экспорта')
        }

        const headers = ['№', 'Реализатор', 'Сумма долга']
        const data = [headers]

        filteredData.forEach((item, idx) => {
            data.push([(idx + 1).toString(), item.client, item.debt.toString()])
        })

        data.push(['ИТОГО', '', calculationsData!.Total.toString()])

        await generateExcel('Учет долгов (Реализаторы)', data)
    }

    useEffect(() => {
        if (calculationsData) {
            const _filteredData = calculationsData.Data.filter((item) => item.debt != 0)
            setFilteredData(_filteredData)
        }
    }, [calculationsData])

    return (
        <>
            <Box className='print-hidden' display='flex' marginBottom={4} gap='15px'>
                <Select
                    onChange={(event) => setParam('contragentName', event.target.value)}
                    placeholder='Реализатор'
                    size='sm'
                    borderRadius={5}
                    width='20%'
                >
                    {clientsData?.map((client) => (
                        <option key={client.id} value={client.contragentName}>
                            {client.contragentName}
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

            <Box>
                <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>№</Th>
                                <Th>Реализатор</Th>
                                <Th>Сумма долга</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filteredData?.length ? (
                                filteredData?.map((item, index) => {
                                    return (
                                        <Tr key={index}>
                                            <Td>{index + 1}</Td>
                                            <Td>{item.client}</Td>
                                            <Td>{item.debt.formatted()}</Td>
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
                                <Th width='60%'></Th>
                                <Th color='#000' fontSize={15}>
                                    {calculationsData?.Total.formatted()}
                                </Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
        </>
    )
}

export default ProviderTable
