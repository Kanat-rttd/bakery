import { useState } from 'react'
import { Box, Select, Td, Th, Tr, Tbody, Table } from '@chakra-ui/react'
import { useApi } from '@/utils/services/axios'
import DateRange from '../../../components/DateRange'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Thead } from '@/components/ui'

interface breadViewData {
    Date: string
    Products: {
        quantity: number
        clientName: string
        productName: string
    }[]
}

interface Client {
    id: string
    name: string
    surname: string
    contact: string
    telegrammId: string
    status: string
}

const ReleaseView = () => {
    const { getURLs } = useURLParameters()
    const { data: breadViewData } = useApi<breadViewData[]>(`reports/bread?${getURLs().toString()}`)
    const { data: clientsData } = useApi<Client[]>('client')

    const [selectedClient, setSelectedClient] = useState('')

    const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClient(event.target.value)
    }

    const getProductNames = () => {
        const productNames = new Set<string>()
        breadViewData?.forEach((entry) => {
            entry.Products.forEach((product) => {
                productNames.add(product.productName)
            })
        })
        return [...productNames]
    }

    const filteredData = breadViewData
        ?.map((entry) => ({
            Date: entry.Date,
            Products: entry.Products.filter(
                (product) => selectedClient === '' || product.clientName === selectedClient,
            ),
        }))
        .filter((entry) => entry.Products.length > 0)

    const sumProductQuantityForDate = (date: string, productName: string) => {
        let sum = 0
        filteredData?.forEach((entry) => {
            if (entry.Date === date) {
                entry.Products.forEach((product) => {
                    if (product.productName === productName) {
                        sum += product.quantity
                    }
                })
            }
        })
        return sum
    }

    const productNames = getProductNames()

    return (
        <Box>
            <Box width='100%' height='100%' p={5} mt={1}>
                <Box marginBottom={6} display='flex' justifyContent='space-between'>
                    <Box display='flex' gap='15px' width='100%'>
                        <DateRange />
                        <Select
                            size='sm'
                            borderRadius={5}
                            width='fit-content'
                            value={selectedClient}
                            onChange={handleClientChange}
                        >
                            <option value=''>Все клиенты</option>
                            {clientsData?.map((client) => (
                                <option key={client.id} value={client.name}>
                                    {client.name}
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
                                    {[...productNames].map((productName, index) => (
                                        <Th key={index}>{productName}</Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredData?.map((entry, index) => (
                                    <Tr key={index}>
                                        <Td>{index + 1}</Td>
                                        <Td>{entry.Date}</Td>
                                        {productNames.map((productName, idx) => (
                                            <Td key={idx}>
                                                {sumProductQuantityForDate(entry.Date, productName)}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </Box>
    )
}

export default ReleaseView
