import { Box, Heading } from '@chakra-ui/react'

const ErrorPage = () => {
    return (
        <Box textAlign='center' p={5}>
            <Heading as='h2' size='lg'>
                Что-то пошло не так
            </Heading>
            {/* Здесь можете добавить дополнительные действия, кнопки и т. д. */}
        </Box>
    )
}

export default ErrorPage
