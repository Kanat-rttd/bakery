import { Box, Tabs, TabList, Tab, TabPanel, TabPanels } from '@chakra-ui/react'
import MagazineTable from '../components/MagazineTable'
import ProviderTable from '../components/ProviderTable'

const DebtAccounting = () => {
    return (
        <>
            <Box width='100%' mt={2} p='0px 5px'>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList justifyContent='right' pt={3} p='10px 10px 0' mb={-12}>
                        <Tab>Реализаторы</Tab>
                        <Tab>Магазины</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <ProviderTable />
                        </TabPanel>
                        <TabPanel>
                            <MagazineTable />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </>
    )
}

export default DebtAccounting
