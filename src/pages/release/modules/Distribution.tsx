import {
    Box,
    Button,
    Select,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
} from '@chakra-ui/react'
import ListTable from '../components/ListTable'
import PivotTable from '../components/PivotTable'
import DistributionModal from '../components/DistributionModal'
import { useApi } from '@/utils/services/axios'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { DispatchType } from '@/utils/types/dispatch.types'
import DateRange from '@/components/DateRange'
import { ChangeEvent, useEffect, useRef } from 'react'

type Dispatch = {
    data: DispatchType[]
    totalPrice: number
    totalQuantity: number
}

export interface FacilityUnit {
    id: number
    facilityUnit: string
}

const Distribution = () => {
    const { getURLs, setParam, getParam } = useURLParameters()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { mutate: mutateDispatchesData } = useApi<Dispatch>(`release?${getURLs().toString()}`)
    const { data: facilityUnitsData } = useApi<FacilityUnit[]>('mixers')

    const listRef = useRef()
    const tableRef = useRef()
    const selectedRef = useRef<{ export: () => void }>()

    const handleUpdateProduct = async () => {
        await mutateDispatchesData()
    }
    const handleClientChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setParam('facilityUnit', event.target.value)
    }

    useEffect(() => {
        selectedRef.current = listRef.current
    })

    return (
        <Box>
            <Box p={5} height='5%' display='flex' justifyContent='space-between'>
                <Box display='flex' gap='15px' width='100%'>
                    <DateRange />
                    <Select
                        className='print-hidden'
                        size='sm'
                        borderRadius={5}
                        placeholder='Цех'
                        width='fit-content'
                        value={getParam('facilityUnit')}
                        onChange={handleClientChange}
                    >
                        {facilityUnitsData?.map((unit, index) => (
                            <option key={index} value={unit.id}>
                                {unit.facilityUnit}
                            </option>
                        ))}
                    </Select>
                </Box>

                <Box className='print-hidden' display='flex' gap='15px'>
                    <Button size='sm' colorScheme='purple' onClick={onOpen} p='0 25px'>
                        Выдача продукции
                    </Button>
                    <Button size='sm' type='button' onClick={() => selectedRef.current?.export()}>
                        Экспорт в Excel
                    </Button>
                    <Button size='sm' type='button' onClick={window.print}>
                        Экспорт в PDF
                    </Button>
                </Box>
            </Box>
            <Box width='100%' height='100%' p={5}>
                <Tabs
                    onChange={(idx) => {
                        if (idx === 0) {
                            selectedRef.current = listRef.current
                        } else {
                            selectedRef.current = tableRef.current
                        }
                    }}
                    variant='soft-rounded'
                    mt='-19.5px'
                >
                    <TabList className='print-hidden' height='22px'>
                        <Tab>List</Tab>
                        <Tab>Pivot</Tab>
                    </TabList>
                    <TabPanels height='95%'>
                        <TabPanel p='10px 0'>
                            <ListTable ref={listRef} status='0' />
                        </TabPanel>
                        <TabPanel p='10px 0'>
                            <PivotTable ref={tableRef} status='0' />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            {isOpen && (
                <DistributionModal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSuccess={handleUpdateProduct}
                    status='0'
                />
            )}
        </Box>
    )
}

export default Distribution
