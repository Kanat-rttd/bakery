import {
    Box,
    Heading,
    Input,
    IconButton,
    Text,
    VStack,
    useToast,
    FormControl,
    FormLabel,
    Container,
} from '@chakra-ui/react'
import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { useDisclosure } from '@chakra-ui/react'
import { useState, ChangeEvent } from 'react'
import BottomModal from '../components/BottomModal'
import getUserInfo from '@/utils/helpers/getUserInfo'
import { createSale } from '@/utils/services/sales.service'
import SuccessPage from '../components/SuccessPage'
import ErrorPage from '../components/ErrorPage'
import MobileNavbar from '@/components/MobileNavbar'
import dayjs from 'dayjs'
import classes from '../index.module.css'

interface Product {
    id: number | null
    name: string
    price: number
    quantity: number | null
}

const RequestForm = () => {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
    const [selectedDate, setSelectedDate] = useState<Date>(dayjs().toDate())
    const [comment, setComment] = useState<string>('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isError, setIsError] = useState(false)
    const { isOpen, onToggle, onClose } = useDisclosure()
    const toast = useToast()

    const userInfo = getUserInfo()

    console.log(userInfo)

    const reset = () => {
        setSelectedProducts([])
        setIsSuccess(false)
        setIsError(false)
    }

    const handleAddProduct = (product: Product): void => {
        setSelectedProducts([...selectedProducts, { ...product, quantity: null }])
        onClose()
    }

    const handleRemoveProduct = (index: number): void => {
        const updatedProducts = [...selectedProducts]
        updatedProducts.splice(index, 1)
        setSelectedProducts(updatedProducts)
    }

    const handleQuantityChange = (index: number, event: ChangeEvent<HTMLInputElement>): void => {
        const updatedProducts = [...selectedProducts]
        updatedProducts[index].quantity =
            event.target.value === '' ? 0 : parseInt(event.target.value)
        setSelectedProducts(updatedProducts)
    }

    const clientId = Number(userInfo?.clientId) || null

    const handleSubmit = (): void => {
        const requestData = {
            date: selectedDate,
            products: selectedProducts.map((product) => ({
                productId: product.id,
                orderedQuantity: product.quantity,
            })),
            comment: comment,
            clientId: Number(clientId),
        }
        if (requestData.products.length === 0) {
            toast({
                title: 'Ошибка.',
                description: 'Выберите товары',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } else if (requestData.products.some((product) => !product.orderedQuantity)) {
            toast({
                title: 'Ошибка.',
                description: 'Укажите количество для всех выбранных товаров',
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
        } else {
            createSale(requestData)
                .then((res) => {
                    if (res.status === 200) {
                        setIsSuccess(true)
                    } else {
                        setIsError(true)
                    }
                })
                .catch((error) => {
                    console.error('Error creating sale:', error)
                    setIsError(true)
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
                            <Heading>Заказ</Heading>
                            <FormControl display='flex' justifyContent='center' alignItems='center'>
                                <FormLabel>Смена: </FormLabel>
                                <Input
                                    variant='filled'
                                    placeholder='Filled'
                                    width='50%'
                                    borderRadius='15'
                                    name='date'
                                    type='date'
                                    defaultValue={dayjs(selectedDate).format('YYYY-MM-DD')}
                                    textAlign='center'
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                />
                            </FormControl>
                        </Box>

                        <Box>
                            <VStack spacing={2}>
                                {selectedProducts.map((product, index) => (
                                    <Box
                                        key={index}
                                        p={5}
                                        display='flex'
                                        flexDirection='row'
                                        alignItems='center'
                                        borderBottom='2px solid #E2E2E2'
                                        className={classes.inputsContainer}
                                    >
                                        <Box width='40%'>
                                            <Text fontWeight='bold'>{product.name}</Text>
                                        </Box>
                                        <Box
                                            display='flex'
                                            width='60%'
                                            justifyContent='space-between'
                                        >
                                            <Input
                                                w='85%'
                                                variant='filled'
                                                borderRadius={15}
                                                name='quantity'
                                                placeholder='Количество'
                                                backgroundColor='gray.100'
                                                value={product.quantity || ''}
                                                onChange={(e) => handleQuantityChange(index, e)}
                                                min='0'
                                            />
                                            <IconButton
                                                bg='transparent'
                                                color='gray'
                                                size='md'
                                                aria-label='remove item'
                                                icon={<CloseIcon />}
                                                onClick={() => handleRemoveProduct(index)}
                                            />
                                        </Box>
                                    </Box>
                                ))}
                            </VStack>
                        </Box>

                        <Box textAlign='center' p={5}>
                            <IconButton
                                backgroundColor='#F7B23B'
                                borderRadius={15}
                                color='white'
                                size='md'
                                aria-label='Send email'
                                marginRight={3}
                                icon={<AddIcon />}
                                onClick={onToggle}
                            />
                        </Box>

                        <Box m={5} borderBottom='1px solid #7C7C7C'>
                            <Text mb='8px' color='#7C7C7C' textAlign='left'>
                                Комментарий
                            </Text>
                            <Input
                                border='none'
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Box>

                        <Box textAlign='center' p={5}>
                            <Input
                                mb='80px'
                                variant='filled'
                                size='lg'
                                color='white'
                                backgroundColor='#F7B23B'
                                placeholder='Filled'
                                width='100%'
                                borderRadius='15'
                                textAlign='center'
                                value='Заказать'
                                onClick={handleSubmit}
                                type='submit'
                            />
                        </Box>
                    </Container>
                </>
            )}
            <BottomModal
                isOpen={isOpen}
                onClose={onClose}
                handleAddProduct={handleAddProduct}
                selectedProducts={selectedProducts}
            />
        </div>
    )
}

export default RequestForm
