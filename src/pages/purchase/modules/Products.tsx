import { Box, Button, Select, useDisclosure } from '@chakra-ui/react'
import ListTable from '../components/ListTable'
import PurchaseModal from '../components/PurchaseModal'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import DateRange from '@/components/DateRange'
import { ProviderType } from '@/utils/types/provider.types'
import { PurchaseType } from '@/utils/types/purchase.types'
import { useRef } from 'react'

interface AllPurchases {
    purchases: PurchaseType[]
    totalQuantity: number
    totalSum: number
    totalDeliverySum: number
}

interface GoodsCategory {
    id: number
    category: string
    unitOfMeasure: string
}

const Products = () => {
    const { getParam, setParam, getURLs } = useURLParameters()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data: providersData } = useApi<ProviderType[]>('providers')
    const { data: goodsCategories } = useApi<GoodsCategory[]>('goodsCategories')
    const ref = useRef<{ export: () => Promise<void> }>()

    const { data: purchasesData, mutate: mutatePurchaseData } = useApi<AllPurchases>(
        `productPurchase?${getURLs().toString()}`,
    )

    const handleAddProduct = async () => {
        await mutatePurchaseData()
    }

    return (
        <>
            <Box width='100%' p={5} pt={7}>
                <Box display='flex' alignItems='center' justifyContent='space-between' mb={5}>
                    <Box display='flex' gap='15px' mb='5px'>
                        <DateRange />
                        <Select
                            className='print-hidden'
                            size='sm'
                            borderRadius={5}
                            placeholder='Поставщик'
                            value={getParam('providerId')}
                            onChange={(event) => setParam('providerId', event.target.value)}
                            width='fit-content'
                        >
                            {providersData?.map((provider, index) => (
                                <option key={`${index}`} value={provider.id}>
                                    {provider.providerName}
                                </option>
                            ))}
                        </Select>
                        <Select
                            className='print-hidden'
                            size='sm'
                            borderRadius={5}
                            placeholder='Товар'
                            value={getParam('goodsCategoryId')}
                            onChange={(event) => setParam('goodsCategoryId', event.target.value)}
                            width='fit-content'
                        >
                            {goodsCategories?.map(({ id, category }) => (
                                <option key={id} value={id}>
                                    {category}
                                </option>
                            ))}
                        </Select>
                        <Select
                            className='print-hidden'
                            placeholder='Статус'
                            width='fit-content'
                            value={getParam('paymentStatus')}
                            size='sm'
                            borderRadius={5}
                            onChange={(e) => setParam('paymentStatus', e.target.value)}
                        >
                            <option value='Оплачено'>Оплачено</option>
                            <option value='Не оплачено'>Не оплачено</option>
                        </Select>
                    </Box>

                    <Box className='print-hidden' display='flex' gap='15px'>
                        <Button size='sm' colorScheme='purple' onClick={onOpen}>
                            Добавить закупки
                        </Button>
                        <Button size='sm' type='button' onClick={() => ref.current?.export()}>
                            Экспорт в Excel
                        </Button>
                        <Button size='sm' type='button' onClick={() => window.print()}>
                            Экспорт в PDF
                        </Button>
                    </Box>
                </Box>
                <ListTable ref={ref} purchasesData={purchasesData} mutate={mutatePurchaseData} />
            </Box>
            <PurchaseModal isOpen={isOpen} onClose={onClose} onSuccess={handleAddProduct} />
        </>
    )
}

export default Products
