import { Table, Tr, Th, Tbody, Td } from '@chakra-ui/react'
import { TableContainer, Tfoot, Thead } from './ui'
import { OrderArrayType } from '@/utils/types/order.types'

const TableData = ({ data }: { data: OrderArrayType[] | undefined }) => {
    const uniqProducts = new Set<string>()
    data?.forEach((order) => {
        order.orderDetails.forEach((detail) => {
            uniqProducts.add(detail.product.name)
        })
    })

    const getColumnTotal = (productName: string) => {
        return data?.reduce((total, item) => {
            const product = item.orderDetails.find(
                (product) => product.product.name === productName,
            )
            return total + (Number(product?.orderedQuantity) || 0)
        }, 0)
    }

    return (
        <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>№</Th>
                        <Th>Реализаторы</Th>
                        {Array.from(uniqProducts).map((name, index) => (
                            <Th minWidth='150px' textAlign='center' key={index}>
                                {name}
                            </Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.length ? (
                        data?.map((item, index) => (
                            <Tr key={index}>
                                <Td>{index + 1}</Td>
                                <Td>{item.client.name}</Td>
                                {Array.from(uniqProducts).map((productName, productIndex) => (
                                    <Td textAlign='center' key={productIndex}>
                                        {item.orderDetails.find(
                                            (prod) => prod.product.name === productName,
                                        )?.orderedQuantity || ''}
                                    </Td>
                                ))}
                            </Tr>
                        ))
                    ) : (
                        <Tr>
                            <Th>Нет данных</Th>
                        </Tr>
                    )}
                </Tbody>
                <Tfoot>
                    <Tr>
                        <Th fontSize={16} fontWeight='bold' color='#000'>
                            Итого
                        </Th>
                        <Th></Th>

                        {Array.from(uniqProducts).map((productName, productIndex) => (
                            <Th
                                marginLeft='50px'
                                minWidth='150px'
                                key={productIndex}
                                fontSize={16}
                                fontWeight='bold'
                                textAlign='center'
                                color='#000'
                            >
                                {getColumnTotal(productName)}
                            </Th>
                        ))}
                    </Tr>
                </Tfoot>
            </Table>
        </TableContainer>
    )
}

export default TableData
