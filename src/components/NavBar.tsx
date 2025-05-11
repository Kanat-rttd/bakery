import { Flex, Image, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { MAIN_ROUTE } from '@/utils/constants/routes.consts'
import MenuAccordion from './MenuAccordion'

const TopNavBar = () => {
    const navigate = useNavigate()

    return (
        <Flex
            h='10vh'
            alignItems='center'
            p='5'
            boxShadow='base'
            position='sticky'
            top='0'
            zIndex='sticky'
            w='full'
            backgroundColor='white'
        >
            <MenuAccordion />

            <Image
                borderRadius='full'
                boxSize='50px'
                src='https://w7.pngwing.com/pngs/802/361/png-transparent-bakery-bread-logo-pretzel-cafe-logo-idea-food-label-cake.png'
                alt='bakery'
                cursor='pointer'
                onClick={() => navigate(MAIN_ROUTE)}
            />
            <Text
                fontSize='xl'
                fontWeight='bold'
                padding='10px'
                cursor='pointer'
                onClick={() => navigate(MAIN_ROUTE)}
            >
                Bread Factory
            </Text>
        </Flex>
    )
}

export default TopNavBar
