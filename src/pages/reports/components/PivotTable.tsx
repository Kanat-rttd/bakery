import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getAllDispatches } from '@/utils/services/dispatch.service'
import { TableContainer, Thead } from '@/components/ui'

interface Dispatch {
    id: number
    clientId: number
    createdAt: Date
    dispatch: string
    goodsDispatchDetails: {
        id: number
        productId: number
        quantity: number
        product: {
            name: string
            price: number
            bakingFacilityUnit: {
                id: number
                facilityUnit: string
            }
        }
    }[]
    client: {
        id: number
        name: string
    }
}

interface PivotTableProps {
    status: string
}

const PivotTable: React.FC<PivotTableProps> = ({ status }) => {
    const [data, setData] = useState<Dispatch[]>([])
    const [headers, setHeaders] = useState<any[]>([])

    useEffect(() => {
        getAllDispatches().then((res) => {
            const uniqueProductNames = [
                ...new Set(
                    res.data
                        .filter((row: Dispatch) => row.dispatch == status)
                        .flatMap((item: Dispatch) =>
                            item.goodsDispatchDetails.map((detail) => detail.product.name),
                        ),
                ),
            ]
            const headers = uniqueProductNames.map((name) => ({ bread: name }))

            setHeaders(headers)
            setData(res.data.filter((row: Dispatch) => row.dispatch == status))
        })
    }, [])

    return (
        <>
            <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>№</Th>
                            <Th>Реализатор</Th>
                            {headers.map((head) => (
                                <Th key={head.bread}>{head.bread}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((row) => (
                            <Tr key={row.id}>
                                <Td>{row.id}</Td>
                                <Td>{row.client.name}</Td>
                                {headers.map((header, index) => {
                                    const quantity = row.goodsDispatchDetails.find(
                                        (detail) => detail.product.name === header.bread,
                                    )?.quantity
                                    return <Td key={index}>{quantity}</Td>
                                })}
                                <Td display='flex' gap='10px'>
                                    <EditIcon boxSize='1.5em' cursor='pointer' />
                                    <DeleteIcon boxSize='1.5em' color='red' cursor='pointer' />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
}

export default PivotTable
