import {
    Box,
    Heading,
    IconButton,
    InputGroup,
    InputLeftElement,
    Input,
    Text,
    Radio,
    Stack,
    useRadioGroup,
} from '@chakra-ui/react'
import { CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { Slide } from '@chakra-ui/transition'
import { useEffect, useState } from 'react'
import { useApi } from '@/utils/services/axios'

interface Product {
    id: number | null
    name: string
    price: number
    quantity: number | null
}

const BottomModal: React.FC<{
    isOpen: boolean
    onClose: () => void
    handleAddProduct: (product: Product) => void
    selectedProducts: Product[]
}> = ({ isOpen, onClose, handleAddProduct, selectedProducts }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const { data: products } = useApi<Product[]>('product?status=1')
    const [filterdProducts, setFilteredProducts] = useState<Product[] | undefined>([])
    const [selectedProductsIds, setSelectedProductsIds] = useState<number[]>([])

    const { getRootProps, getRadioProps } = useRadioGroup()

    useEffect(() => {
        setSelectedProductsIds(selectedProducts.map((product) => Number(product.id)))
    }, [selectedProducts])

    useEffect(() => {
        setFilteredProducts(
            products?.filter((product) => !selectedProductsIds.includes(Number(product.id))),
        )
    }, [selectedProductsIds])

    useEffect(() => {
        if (!products) return
        setFilteredProducts(products)
    }, [products])

    return (
        <>
            {isOpen && (
                <>
                    <Box
                        position='fixed'
                        top='0'
                        left='0'
                        width='100vw'
                        height='100vh'
                        backgroundColor='rgba(0, 0, 0, 0.5)'
                        zIndex='999'
                        onClick={onClose}
                    />
                    <Slide direction='bottom' in={isOpen} style={{ zIndex: 1000 }}>
                        <Box
                            color='white'
                            mt='4'
                            bg='white'
                            shadow='md'
                            borderTopLeftRadius={20}
                            borderTopRightRadius={20}
                        >
                            <Box p={5} height='50vh' display='flex' flexDirection='column' gap={5}>
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    justifyContent='space-between'
                                >
                                    <Heading color='black' size='md'>
                                        Выбор товара
                                    </Heading>
                                    <IconButton
                                        variant='outline'
                                        size='sm'
                                        color='black'
                                        aria-label='Close modal'
                                        icon={<CloseIcon />}
                                        onClick={onClose}
                                    />
                                </Box>

                                <Box>
                                    <InputGroup>
                                        <InputLeftElement pointerEvents='none'>
                                            <SearchIcon color='black' />
                                        </InputLeftElement>
                                        <Input
                                            color='black'
                                            fontWeight={600}
                                            placeholder='Поиск товара'
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                </Box>
                                <Box {...getRootProps()}>
                                    <Stack spacing={2}>
                                        {filterdProducts?.length ? (
                                            filterdProducts
                                                ?.filter((product) =>
                                                    product.name
                                                        .toLowerCase()
                                                        .includes(searchTerm.toLowerCase()),
                                                )
                                                .map((product) => (
                                                    <label
                                                        key={product.id}
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleAddProduct(product)}
                                                    >
                                                        <Stack
                                                            direction='row'
                                                            alignItems='center'
                                                            justifyContent='space-between'
                                                        >
                                                            <Text
                                                                color='black'
                                                                size='lg'
                                                                fontWeight='600'
                                                            >
                                                                {product.name}
                                                            </Text>
                                                            <Radio
                                                                {...getRadioProps({
                                                                    value: product.id,
                                                                })}
                                                                border='2px solid #F7B23B'
                                                            />
                                                        </Stack>
                                                    </label>
                                                ))
                                        ) : (
                                            <Text color='black' size='lg' fontWeight='600'>
                                                Нет доступного для выбора продукта
                                            </Text>
                                        )}
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    </Slide>
                </>
            )}
        </>
    )
}

export default BottomModal
