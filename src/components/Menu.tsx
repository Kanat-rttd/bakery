import {
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Icon,
    Heading,
    Link,
    Divider,
    Box,
} from '@chakra-ui/react'
import { menuItems, subMenuItems } from '../utils/constants/menu.consts'
import { LOGIN_ROUTE } from '../utils/constants/routes.consts'
import { useRef, Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import getUserInfo from '@/utils/helpers/getUserInfo'

/**
 * Custom navigation menu
 * We use getUserInfo function where we receive permissions for certain pages
 * and using this and menuItems from constants rendered correct forms in the menu
 * @returns {JSX}
 */
const Drawler = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const navigate = useNavigate()
    const btnRef = useRef<HTMLButtonElement | null>(null)

    const toggleDrawer = () => {
        setIsDrawerOpen((prev: unknown) => !prev)
    }

    const userInfo = getUserInfo()

    const filteredMenuItems = menuItems.filter((item) => {
        return (
            userInfo?.class && item.allowedClasses && item.allowedClasses.includes(userInfo.class)
        )
    })

    const handleNavigate = (route: string) => {
        setIsDrawerOpen(false)
        navigate(route)
    }

    return (
        <>
            <Button ref={btnRef} colorScheme='white' onClick={toggleDrawer}>
                <Icon viewBox='0 0 24 24' fill='none' boxSize={6} color='black'>
                    <path d='M4 6H20M4 12H20M4 18H20' stroke='#000000' strokeWidth='2'></path>
                </Icon>
            </Button>
            {isDrawerOpen && (
                <Drawer
                    isOpen={isDrawerOpen}
                    placement='left'
                    onClose={() => setIsDrawerOpen(false)}
                    finalFocusRef={btnRef}
                >
                    <DrawerOverlay width='100%' />
                    <DrawerContent width='100%'>
                        <DrawerCloseButton />
                        <DrawerHeader>Меню</DrawerHeader>

                        <DrawerBody display='flex' p={2} gap='0.5rem' flexDirection='column'>
                            {filteredMenuItems.map((MenuItem) => (
                                <Fragment key={MenuItem.route}>
                                    <Divider border='1px solid' />
                                    <Heading paddingLeft='0.5rem' p={2} size='sm'>
                                        {MenuItem.label}
                                    </Heading>
                                    <Box
                                        display='flex'
                                        flexDirection='column'
                                        width='100%'
                                        gap='1.2rem'
                                        textAlign='start'
                                        paddingLeft='2rem'
                                    >
                                        {subMenuItems.map(
                                            ({ route, label, path }) =>
                                                path === MenuItem.route && (
                                                    <Link
                                                        key={route}
                                                        variant='ghost'
                                                        width='60%'
                                                        lineHeight='20px'
                                                        onClick={() => handleNavigate(route)}
                                                    >
                                                        {label}
                                                    </Link>
                                                ),
                                        )}
                                    </Box>
                                </Fragment>
                            ))}
                        </DrawerBody>

                        <DrawerFooter>
                            <Link
                                onClick={() => {
                                    window.localStorage.removeItem('authToken')
                                    navigate(LOGIN_ROUTE)
                                }}
                            >
                                Выход
                            </Link>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    )
}

export default Drawler
