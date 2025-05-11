import { Box, Image, Link } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import TopNavBar from '../components/NavBar'
import { MAIN_ROUTE } from '../utils/constants/routes.consts'

const NotFound = () => {
    const navigate = useNavigate()

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
                <Image
                    borderRadius='full'
                    src='https://www.akilligundem.com/wp-content/uploads/2022/03/error-404-page-not-found-hatasi-nasil-cozulur-0-1ELWuxVK.jpeg'
                    alt='404'
                />
                <Link
                    fontSize='22'
                    color='blue.500'
                    cursor='pointer'
                    onClick={() => navigate(MAIN_ROUTE)}
                >
                    Вернитесь на главную страницу
                </Link>
            </Box>
        </>
    )
}

export default NotFound
