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
import PivotTable from '../components/PivotTable'
import DistributionModal from '../components/DistributionModal'
import DateRange from '@/components/DateRange'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useApi } from '@/utils/services/axios'
import ListTable from '../components/ListTable'
import { useEffect, useRef } from 'react'
import { useURLParameters } from '@/utils/hooks/useURLParameters.tsx'

export interface FacilityUnit {
    id: number
    facilityUnit: string
}

const Refund = () => {
    const { data: facilityUnitsData } = useApi<FacilityUnit[]>('mixers')
    const { setParam } = useURLParameters()

    const { isOpen, onOpen, onClose } = useDisclosure()
    const listRef = useRef()
    const tableRef = useRef()
    const selectedRef = useRef<{ export: () => void }>()

    useEffect(() => {
        selectedRef.current = listRef.current
    })

    return (
        <Box>
            <UniversalComponent>
                <Box width='100%' height='100%' p={5}>
                    <Box
                        marginBottom='35px'
                        height='5%'
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Box display='flex' gap='15px' width='fit-content'>
                            <DateRange />
                            <Select
                                className='print-hidden'
                                placeholder='Цех'
                                width='fit-content'
                                size='sm'
                                borderRadius={5}
                                onChange={(event) => setParam('facilityUnit', event.target.value)}
                            >
                                {facilityUnitsData?.map((unit, index) => (
                                    <option key={index} value={unit.id}>
                                        {unit.facilityUnit}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Box className='print-hidden' display='flex' gap='15px'>
                            <Button size='sm' colorScheme='purple' onClick={onOpen} p='0 15px'>
                                Возврат продукции
                            </Button>
                            <Button
                                size='sm'
                                type='button'
                                onClick={() => selectedRef.current?.export()}
                            >
                                Экспорт в Excel
                            </Button>
                            <Button size='sm' type='button' onClick={window.print}>
                                Экспорт в PDF
                            </Button>
                        </Box>
                    </Box>
                    <Box>
                        <Tabs
                            onChange={(idx) => {
                                if (idx === 0) {
                                    selectedRef.current = listRef.current
                                } else {
                                    selectedRef.current = tableRef.current
                                }
                            }}
                            variant='soft-rounded'
                            mt='-10px'
                        >
                            <TabList className='print-hidden' height='22px'>
                                <Tab>List</Tab>
                                <Tab>Pivot</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel p='10px 0'>
                                    <ListTable ref={listRef} status='1' />
                                </TabPanel>
                                <TabPanel p='10px 0'>
                                    <PivotTable ref={tableRef} status='1' />
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Box>
            </UniversalComponent>
            <DistributionModal
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={() => console.log('1')}
                data={undefined}
                status='1'
            />
        </Box>
    )
}

export default Refund
