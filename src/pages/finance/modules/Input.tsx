import IsMobile from '@/utils/helpers/isMobile'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import Arrival from '../components/Arrival'
import Consumption from '../components/Consumption'
import { useState } from 'react'
import { useApi } from '@/utils/services/axios'

interface Category {
    id: number
    name: string
    type: string
    contragentTypeId: number
}

const Input = () => {
    const [selectedType, setSelectedType] = useState<string>('Приход')
    const { data: categoriesData } = useApi<Category[] | undefined>(
        `financeCategories?type=${selectedType.toString()}`,
    )
    return (
        <>
            <Box display='flex' width='100%' justifyContent='center' marginTop={3}>
                <Box
                    height='100%'
                    width={IsMobile() ? '100%' : '25%'}
                    display='flex'
                    flexDirection='column'
                    gap='30px'
                >
                    <Box
                        background='white'
                        borderRadius='5px'
                        boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
                    >
                        <Tabs>
                            <TabList justifyContent='center'>
                                <Tab onClick={() => setSelectedType('Приход')}>Приход</Tab>
                                <Tab onClick={() => setSelectedType('Расход')}>Расход</Tab>
                                {/*<Tab>Перевод</Tab>*/}
                            </TabList>
                            <TabPanels>
                                <TabPanel display='flex' flexDirection='column' gap='15px'>
                                    <Arrival categoriesData={categoriesData} />
                                </TabPanel>
                                <TabPanel display='flex' flexDirection='column' gap='15px'>
                                    <Consumption categoriesData={categoriesData} />
                                </TabPanel>
                                {/*<TabPanel display='flex' flexDirection='column' gap='15px'>*/}
                                {/*    <Transfer />*/}
                                {/*</TabPanel>*/}
                            </TabPanels>
                        </Tabs>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Input
