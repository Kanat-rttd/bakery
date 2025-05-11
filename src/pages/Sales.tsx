import TopNavBar from '../components/NavBar'
import { Box } from '@chakra-ui/react'

const Sales = () => {
    return (
        <>
            <TopNavBar></TopNavBar>
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                height='80vh'
            >
                Sales Page
            </Box>
        </>
    )
}

export default Sales
