import { Box, Button, Select, useDisclosure } from '@chakra-ui/react'
import InventoryTable from '../components/InventoryTable'
import CorrectModal from '../components/Modal'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import UniversalComponent from '@/components/ui/UniversalComponent.tsx'

type GoodsCategoryType = {
    id: number
    category: string
    unitOfMeasure: string
}

const Inventory = () => {
    const { setParam, getParam } = useURLParameters()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { data: goodsCategoriesData } = useApi<GoodsCategoryType[]>('goodsCategories')

    const onSuccess = () => {
        console.log('success')
    }

    return (
        <>
            <UniversalComponent>
                <Box
                    display='flex'
                    flexDirection='column'
                    maxHeight='calc(95% - 2.5rem)'
                    height='100vh'
                    p={5}
                    mt={1}
                >
                    <Box marginBottom={5} display='flex' justifyContent='space-between'>
                        <Box width='100%' display='flex' gap='15px'>
                            <Select
                                placeholder='Все товары'
                                width='20%'
                                size='sm'
                                borderRadius={5}
                                value={getParam('productId')}
                                onChange={(e) => {
                                    setParam('productId', e.target.value)
                                }}
                            >
                                {goodsCategoriesData?.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.category}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Button size='sm' colorScheme='purple' onClick={onOpen}>
                            Корректировка
                        </Button>
                    </Box>
                    <Box position='relative'>
                        <InventoryTable />
                    </Box>
                </Box>

                <CorrectModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />
            </UniversalComponent>
        </>
    )
}

export default Inventory
