import { Box, Button, Select, useDisclosure } from '@chakra-ui/react'
import FactTable from '../components/FactTable'
import FactModal from '../components/AddFactModal'
import { useApi } from '@/utils/services/axios'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { FactInputType } from '@/utils/types/factInput.types'

interface Place {
    label: string
}

type GoodsCategoryType = {
    id: number
    category: string
    unitOfMeasure: string
}

const Fact = () => {
    const { getURLs, setParam, getParam } = useURLParameters()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { mutate: mutateFactInput } = useApi<FactInputType>(`factInput?${getURLs().toString()}`)

    const { data: goodsCategoriesData } = useApi<GoodsCategoryType[]>('goodsCategories')
    const { data: placesData } = useApi<Place[]>('place')

    const successHandler = () => {
        mutateFactInput()
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <>
            <Box
                display='flex'
                flexDirection='column'
                maxHeight='calc(95% - 2.5rem)'
                height='100vh'
                p={5}
                mt={2}
            >
                <Box marginBottom={4} display='flex' justifyContent='space-between'>
                    <Box width='100%' display='flex' gap='15px'>
                        <Select
                            placeholder='Все товары'
                            w='20%'
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

                        <Select
                            placeholder='Место'
                            width='fit-content'
                            w='20%'
                            size='sm'
                            borderRadius={5}
                            value={getParam('place')}
                            onChange={(e) => {
                                setParam('place', e.target.value)
                            }}
                        >
                            {placesData?.map((item, index) => (
                                <option key={index} value={item.label}>
                                    {item.label}
                                </option>
                            ))}
                        </Select>
                    </Box>

                    <Button colorScheme='purple' onClick={onOpen}>
                        Добавить факт
                    </Button>
                </Box>
                <Box position='relative'>
                    <FactTable />
                </Box>
            </Box>
            {isOpen && (
                <FactModal isOpen={isOpen} onClose={handleClose} onSuccess={successHandler} />
            )}
        </>
    )
}

export default Fact
