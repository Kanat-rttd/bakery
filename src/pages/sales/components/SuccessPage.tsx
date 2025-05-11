import { Box, Heading, Text, Image, Button } from '@chakra-ui/react'
import { SALES_HISTORY_ROUTE } from '@/utils/constants/routes.consts'
import { useNavigate } from 'react-router-dom'
import SuccessImg from '../../../assets/success.png'

const SuccessPage = ({ reset }: { reset: () => void }) => {
    const navigator = useNavigate()

    const redirectToHistory = () => {
        navigator(SALES_HISTORY_ROUTE)
    }

    return (
        <Box
            textAlign='center'
            p={5}
            position='relative'
            minHeight='100vh'
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
        >
            <Image pr={7} src={SuccessImg} alt='SuccessImg' />

            <Heading as='h2' size='lg' mb={50}>
                Заказ успешно создан
            </Heading>

            <Text mb={3}>Ваши товары скоро будут ждать вас</Text>

            <Box position='absolute' bottom={0} left={0} right={0} p={5}>
                <Button
                    size='lg'
                    color='white'
                    backgroundColor='#F7B23B'
                    width='100%'
                    borderRadius={15}
                    textAlign='center'
                    mb={2}
                    onClick={reset}
                >
                    Еще заказ
                </Button>
                <Button
                    variant='filled'
                    size='lg'
                    color='black'
                    backgroundColor='white'
                    width='100%'
                    borderRadius={15}
                    textAlign='center'
                    onClick={redirectToHistory}
                >
                    История заказов
                </Button>
            </Box>
        </Box>
    )
}

export default SuccessPage
