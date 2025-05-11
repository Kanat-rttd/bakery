import { Box, Heading, Text, IconButton, Container } from '@chakra-ui/react'
import MobileNavbar from '@/components/MobileNavbar'
import { getByClient } from '@/utils/services/sales.service'
import { useState, useEffect } from 'react'
import { ChevronRightIcon } from '@chakra-ui/icons'
import dayjs from 'dayjs'
import ru from 'dayjs/locale/ru'
import { useNavigate } from 'react-router-dom'
import { SALES_HISTORY_ROUTE } from '@/utils/constants/routes.consts'

interface SalesOrder {
    id: number
    userId: number
    client: Client
    totalQuantity: number
    createdAt: string
    orderDetails: OrderDetails[]
}

interface OrderDetails {
    productId: number
    product: ProductDetails[]
}

interface Client {
    id: number
    name: string
}

interface ProductDetails {
    name: string
    price: number
}

const History = () => {
    const navigator = useNavigate()
    const [getSalesData, setSalesData] = useState<SalesOrder[]>([])

    useEffect(() => {
        getByClient().then((res) => {
            setSalesData(res)
            console.log(res)
        })
    }, [])

    return (
        <>
            <MobileNavbar />
            <Container overflowY='scroll' maxWidth='4xl'>
                <Box display='flex' flexDirection='column' height='100vh' textAlign='center'>
                    <Box borderBottom='1px solid black' p={5}>
                        <Heading size='md'>История</Heading>
                    </Box>
                    <Box>
                        {getSalesData.map((order, index) => (
                            <Box
                                key={index}
                                p={5}
                                display='flex'
                                flexDirection='row'
                                justifyContent='space-between'
                                alignItems='center'
                                borderBottom='1px solid black'
                            >
                                <Box display='flex' flexDirection='row' gap={10}>
                                    <Text>
                                        {dayjs(order.createdAt).locale(ru).format('DD MMM')}
                                    </Text>
                                    <Text fontWeight='bold'>#{order.id}</Text>
                                </Box>
                                <IconButton
                                    variant='filled'
                                    w={8}
                                    h={8}
                                    colorScheme='black'
                                    aria-label='Edit product'
                                    icon={<ChevronRightIcon />}
                                    onClick={() => navigator(`${SALES_HISTORY_ROUTE}/${order.id}`)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default History
