import {
    Avatar,
    Box,
    BoxProps,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from '@chakra-ui/react'
import classes from './style.module.css'
import MenuAccordion from '../MenuAccordion'
import { useNavigate } from 'react-router-dom'
import { LOGIN_ROUTE } from '@/utils/constants/routes.consts'
import { buttonsData } from '@/utils/constants/headerButtons.consts'
import cn from 'classnames'

interface StyledContainerProps extends BoxProps {
    children?: React.ReactNode
    buttons?: buttonsData[] | undefined
}

const Header: React.FC<StyledContainerProps> = ({ buttons }) => {
    const navigate = useNavigate()

    const handleLogOut = () => {
        window.localStorage.removeItem('authToken')
        navigate(LOGIN_ROUTE, { replace: true })
    }
    return (
        <Box as='header' className={cn(classes.header, 'print-hidden')}>
            <Box width='100%' display='flex'>
                <MenuAccordion />
                {buttons && (
                    <Box w='100%' h='100%'>
                        {buttons?.map((button) => {
                            return (
                                <Button
                                    key={button.path}
                                    height='100%'
                                    p='0 25px'
                                    onClick={() => navigate(button.path)}
                                    style={
                                        button.isCurrentPage
                                            ? { backgroundColor: 'rgba(217, 217, 217, 1)' }
                                            : {}
                                    }
                                >
                                    {button.label}
                                </Button>
                            )
                        })}
                    </Box>
                )}
            </Box>
            <Box className={classes.logo}>
                <Menu>
                    <MenuButton borderRadius='25px'>
                        <Avatar width='35px' height='35px' bg='teal.500' mr={2} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={handleLogOut}>
                            <Text>Выйти</Text>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
        </Box>
    )
}

export default Header
