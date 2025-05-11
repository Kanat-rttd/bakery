import { Box, Container, Heading, IconButton, Input, Text, VStack } from '@chakra-ui/react'
import { ChevronLeftIcon, CloseIcon } from '@chakra-ui/icons'
import { ChangeEvent, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import MobileNavbar from '@/components/MobileNavbar'
import { useNavigate, useParams } from 'react-router-dom'
import { getSaleById, saveOrderChanges } from '@/utils/services/sales.service'
import { SALES_HISTORY_ROUTE, SALES_REQUEST_FORM_ROUTE } from '@/utils/constants/routes.consts'
import SuccessPage from '../components/SuccessPage'
import ErrorPage from '../components/ErrorPage'

interface Order {
    id: number
    userId: number
    totalPrice: number
    createdAt: string
    orderDetails: OrderDetail[]
}

interface Product {
    name: string
    price: number
}

interface OrderDetail {
    productId: number
    orderedQuantity: number
    product: Product
    orderDetailsId: number
}

const OrderHistory = () => {
    const { id } = useParams<{ id?: string }>()
    const navigator = useNavigate()

    const [orderData, setOrderData] = useState<Order | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState<OrderDetail[]>([])
    const [removedOrderData, setRemovedOrderData] = useState<Order | null>(null)

    const orderId = id ? parseInt(id, 10) : undefined

    useEffect(() => {
        if (orderId !== undefined) {
            getSaleById(orderId)
                .then((res) => {
                    setOrderData(res.data)
                    setSelectedProducts(res.data.orderDetails)
                })
                .catch((error) => {
                    console.error('Error fetching order:', error)
                })
        }
    }, [orderId])

    const reset = () => navigator(SALES_REQUEST_FORM_ROUTE)

    const handleRemoveProduct = (productId: number): void => {
        if (orderData) {
            const removedOrderDetails = orderData.orderDetails.filter(
                (item) => item.productId === productId,
            )

            const updatedOrderDetails = orderData.orderDetails.filter(
                (item) => item.productId !== productId,
            )

            const updatedOrderData: Order = {
                ...orderData,
                orderDetails: updatedOrderDetails,
            }

            setOrderData(updatedOrderData)
            setSelectedProducts(updatedOrderData.orderDetails)

            setRemovedOrderData((prevRemovedOrderData: Order | null) => ({
                ...prevRemovedOrderData!,
                id: orderId!,
                orderDetails: [
                    ...(prevRemovedOrderData?.orderDetails || []),
                    ...removedOrderDetails,
                ],
            }))
        }
    }

    const handleQuantityChange = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
        const updatedProducts = [...selectedProducts]
        updatedProducts[index].orderedQuantity =
            event.target.value === '' ? 0 : parseInt(event.target.value)
        setSelectedProducts(updatedProducts)
    }

    const handleSaveChanges = () => {
        if (orderData) {
            console.log(removedOrderData)
            console.log(orderData.id, selectedProducts)
            saveOrderChanges(orderData.id, selectedProducts)
                .then((res) => {
                    if (res.status === 200) {
                        setIsSuccess(true)
                    } else {
                        setIsError(true)
                    }
                })
                .catch((error) => {
                    console.error('Error saving changes:', error)
                    // toast({
                    //     title: 'Ошибка сохранения изменений',
                    //     status: 'error',
                    // });
                })
        }
    }

    return (
        <div style={{ overflowY: 'auto', height: '100dvh' }}>
            {isSuccess ? (
                <SuccessPage reset={reset} />
            ) : isError ? (
                <ErrorPage />
            ) : (
                <>
                    <MobileNavbar />
                    <Container
                        maxWidth='4xl'
                        display='flex'
                        flexDirection='column'
                        height='100vh'
                        backgroundColor='white'
                        gap={5}
                    >
                        <Box
                            borderBottom='2px solid #E2E2E2'
                            width='100%'
                            display='flex'
                            flexDirection='column'
                            textAlign='center'
                            alignItems='center'
                            p={5}
                            gap={4}
                        >
                            <Box display='flex' flexDirection='row' alignItems='flex-start'>
                                <IconButton
                                    position='absolute'
                                    variant='filled'
                                    w={8}
                                    h={8}
                                    colorScheme='black'
                                    aria-label='Edit product'
                                    icon={<ChevronLeftIcon />}
                                    onClick={() => navigator(SALES_HISTORY_ROUTE)}
                                    mt={1}
                                />
                                <Box width='100%'>
                                    <Heading
                                        size='lg'
                                        textAlign='center'
                                        alignSelf='flex-start'
                                        mt={1}
                                    >
                                        Заказ №{orderData?.id}
                                    </Heading>
                                </Box>
                            </Box>
                            <Input
                                variant='filled'
                                placeholder='Filled'
                                width='50%'
                                borderRadius='15'
                                name='date'
                                defaultValue={dayjs(orderData?.createdAt).format('DD.MM.YYYY')}
                                textAlign='center'
                            />
                        </Box>

                        <Box>
                            <VStack spacing={2}>
                                {orderData?.orderDetails.map((product, index) => (
                                    <Box
                                        key={index}
                                        p={5}
                                        display='flex'
                                        flexDirection='row'
                                        alignItems='center'
                                    >
                                        <Box width='60%'>
                                            {' '}
                                            <Text fontWeight='bold'>
                                                {product.product.name}
                                            </Text>{' '}
                                        </Box>
                                        <Box display='flex' flexDirection='row' width='40%'>
                                            <Input
                                                variant='filled'
                                                borderRadius={15}
                                                name='quantity'
                                                backgroundColor='gray.100'
                                                value={product.orderedQuantity}
                                                onChange={(e) => handleQuantityChange(index, e)}
                                            />
                                            <IconButton
                                                bg='transparent'
                                                color='gray'
                                                size='md'
                                                aria-label='remove item'
                                                marginRight={3}
                                                icon={<CloseIcon />}
                                                onClick={() =>
                                                    handleRemoveProduct(product.productId)
                                                }
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>

                        <Box m={5} borderBottom='1px solid #7C7C7C'>
                            <Text mb='8px' color='#7C7C7C' textAlign='left'>
                                Комментарий
                            </Text>
                            {/* <Input
                        border={'none'}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    /> */}
                        </Box>

                        <Box textAlign='center' p={5}>
                            <Input
                                variant='filled'
                                size='lg'
                                color='white'
                                backgroundColor='#F7B23B'
                                placeholder='Filled'
                                width='100%'
                                borderRadius='15'
                                textAlign='center'
                                value='Редактировать'
                                type='submit'
                                onClick={handleSaveChanges}
                            />
                        </Box>
                    </Container>
                </>
            )}
        </div>
    )
}

export default OrderHistory
