// import { TableContainer, Table, Thead, Tr, Th, Tbody, Td } from '@chakra-ui/react'
// import { useEffect, useState } from 'react'

// import { getAllProducts } from '../../../utils/services/product.service'
// import { ProductList } from '../../../utils/types/types'

// const AdminPanel = () => {
//     const [data, setData] = useState<ProductList[]>([])

//     useEffect(() => {
//         getAllProducts().then((responseData) => {
//             setData(responseData)
//         })
//     }, [])

//     return (
//         <TableContainer maxWidth={'100%'} width={'100%'} p={5}>
//             <Table variant="striped" colorScheme="teal" size="lg" width={'100%'}>
//                 <Thead>
//                     <Tr>
//                         <Th p={0}>Продукты</Th>
//                         <Th p={0}>Цех</Th>
//                     </Tr>
//                 </Thead>
//                 <Tbody>
//                     {data.map((product, index) => {
//                         return (
//                             <Tr key={index}>
//                                 <Td>{product.id}</Td>
//                                 <Td>{product.name}</Td>
//                             </Tr>
//                         )
//                     })}
//                 </Tbody>
//             </Table>
//         </TableContainer>
//     )
// }

// export default AdminPanel
