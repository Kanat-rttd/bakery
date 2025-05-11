import {
    Box,
    Stack,
    InputGroup,
    InputLeftAddon,
    InputRightElement,
    Button,
    Input,
    Heading,
    useToast,
    Text,
} from '@chakra-ui/react'

import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

import { loginUser } from '../utils/services/user.service'

import { MAIN_ROUTE } from '../utils/constants/routes.consts'
import { SALES_REQUEST_FORM_ROUTE } from '../utils/constants/routes.consts'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import getUserInfo from '@/utils/helpers/getUserInfo'

const Login = () => {
    const navigate = useNavigate()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [password, setPassword] = useState('')
    const toast = useToast()

    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputPhoneNumber = e.target.value
        const cleanedInput = inputPhoneNumber.replace(/\D/g, '')

        if (cleanedInput.length <= 10) {
            setPhoneNumber(cleanedInput)
        } else {
            //console.log('limit')
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault()
        const data = { phone: phoneNumber, pass: password }

        loginUser(data)
            .then((res) => {
                window.localStorage.setItem('authToken', res.data.token)
                const userInfo = getUserInfo()
                if (JSON.parse(String(userInfo?.class))[0].label == 'Реализатор') {
                    navigate(SALES_REQUEST_FORM_ROUTE)
                } else {
                    navigate(MAIN_ROUTE)
                }
            })
            .catch((error) => {
                toast({
                    title: 'Ошибка авторизаций.',
                    description: error.response.data,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            })
    }

    return (
        <Box
            display='flex'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            height='100vh'
            width='100%'
            p='3em'
        >
            <Box width='100%' marginBottom={5}>
                <Heading textAlign='left'>Вход</Heading>
                <Text color='#7C7C7C'>Введите телефон и пароль</Text>
            </Box>
            <Stack onSubmit={handleSubmit} as='form' width='100%' spacing={4}>
                <Box>
                    <Text mb='8px'>Телефон: </Text>
                    <InputGroup size='lg'>
                        <InputLeftAddon>+7</InputLeftAddon>
                        <Input
                            type='tel'
                            placeholder='(777)-777-77-77'
                            value={phoneNumber}
                            onChange={handleInputChange}
                        />
                    </InputGroup>
                </Box>

                <Box marginBottom={15}>
                    <Text mb='8px'>Пароль: </Text>
                    <InputGroup size='lg'>
                        <Input
                            pr='4.5rem'
                            type={show ? 'text' : 'password'}
                            placeholder='Введите пароль'
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button
                                h='1.75rem'
                                size='lg'
                                backgroundColor='transparent'
                                onClick={handleClick}
                            >
                                {show ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Box>

                <Button
                    size='lg'
                    borderRadius={15}
                    backgroundColor='#F7B23B'
                    color='white'
                    type='submit'
                >
                    Войти
                </Button>
            </Stack>
        </Box>
    )
}

export default Login
