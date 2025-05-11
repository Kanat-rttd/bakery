import { Box, Spinner } from '@chakra-ui/react'

/**
 * Default Loader which you can use between page or big fetch
 * @returns {JSX}
 */
const Loading = () => {
    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100vh'
        >
            <Spinner thickness='5px' size='xl' speed='0.65s' color='blue.500' />
        </Box>
    )
}

export default Loading
