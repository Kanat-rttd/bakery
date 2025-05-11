import {
    Box,
    Button,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    useDisclosure,
} from '@chakra-ui/react'
import ListTable from '../components/ListTable'
import DistributionModal from '../components/DistributionModal'
import PivotTable from '../components/PivotTable'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { ShiftAccountingType } from '@/utils/types/shiftAccounting.types'
import { useApi } from '@/utils/services/axios'
import { useEffect, useRef } from 'react'

export default function ShiftAccounting() {
    const { getURLs } = useURLParameters()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const listRef = useRef()
    const tableRef = useRef()
    const selectedRef = useRef<{ export: () => void }>()

    const { data: shiftAccounting, mutate: mutateShiftAccountingData } = useApi<
        ShiftAccountingType[]
    >(`shiftAccounting?${getURLs().toString()}`)

    useEffect(() => {
        selectedRef.current = listRef.current
    })

    return (
        <Box mt={1}>
            <Tabs
                onChange={(idx) => {
                    if (idx === 0) {
                        selectedRef.current = listRef.current
                    } else {
                        selectedRef.current = tableRef.current
                    }
                }}
                variant='soft-rounded'
                height='100%'
                mt='-10px'
            >
                <Box width='100%' height='100%' p={5}>
                    <Box className='print-hidden' display='flex' justifyContent='space-between'>
                        <TabList height='22px'>
                            <Tab>List</Tab>
                            <Tab>Pivot</Tab>
                        </TabList>
                        <Box display='flex' gap='15px'>
                            <Button size='sm' colorScheme='purple' onClick={onOpen}>
                                Добавить часы
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
                    <TabPanels mt={3} height='100%'>
                        <TabPanel height='100%' p='10px 0'>
                            <ListTable
                                ref={listRef}
                                shiftAccounting={shiftAccounting}
                                mutate={mutateShiftAccountingData}
                            />
                        </TabPanel>
                        <TabPanel p='10px 0'>
                            <PivotTable ref={tableRef} shiftAccounting={shiftAccounting} />
                        </TabPanel>
                    </TabPanels>
                </Box>
            </Tabs>
            <DistributionModal
                isOpen={isOpen}
                onClose={onClose}
                onOpen={onOpen}
                onSuccess={mutateShiftAccountingData}
                data={undefined}
            />
        </Box>
    )
}
