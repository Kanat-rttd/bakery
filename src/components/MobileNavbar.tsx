import { Box, Icon, createIcon, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import {
    SALES_REQUEST_FORM_ROUTE,
    SALES_HISTORY_ROUTE,
    LOGIN_ROUTE,
} from '@/utils/constants/routes.consts'
import React from 'react'

const MySvgIcon = createIcon({
    displayName: 'MySvgIcon',
    viewBox: '0 0 22 20',
    path: (
        <path
            fill='#F7B23B'
            d='M8.53596 19.5629C7.88741 19.5629 7.26542 19.3053 6.80683 18.8467C6.34823 18.3881 6.0906 17.7661 6.0906 17.1175C6.0906 16.469 6.34823 15.847 6.80683 15.3884C7.26542 14.9298 7.88741 14.6722 8.53596 14.6722C9.18451 14.6722 9.8065 14.9298 10.2651 15.3884C10.7237 15.847 10.9813 16.469 10.9813 17.1175C10.9813 17.7661 10.7237 18.3881 10.2651 18.8467C9.8065 19.3053 9.18451 19.5629 8.53596 19.5629ZM17.0947 19.5629C16.4462 19.5629 15.8242 19.3053 15.3656 18.8467C14.907 18.3881 14.6494 17.7661 14.6494 17.1175C14.6494 16.469 14.907 15.847 15.3656 15.3884C15.8242 14.9298 16.4462 14.6722 17.0947 14.6722C17.7433 14.6722 18.3653 14.9298 18.8239 15.3884C19.2825 15.847 19.5401 16.469 19.5401 17.1175C19.5401 17.7661 19.2825 18.3881 18.8239 18.8467C18.3653 19.3053 17.7433 19.5629 17.0947 19.5629ZM1.15341 2.35122C0.84818 2.34137 0.558746 2.2132 0.346313 1.99381C0.133881 1.77441 0.0151062 1.481 0.0151062 1.17561C0.0151062 0.870221 0.133881 0.576806 0.346313 0.357411C0.558746 0.138017 0.84818 0.0098448 1.15341 0L2.56071 0C3.66357 0 4.61727 0.765399 4.85691 1.84136L6.38893 8.73973C6.62858 9.81569 7.58227 10.5811 8.68513 10.5811H17.8699L19.633 3.52622H8.20706C7.9047 3.51242 7.6193 3.3826 7.41022 3.16375C7.20113 2.94491 7.08446 2.65389 7.08446 2.35122C7.08446 2.04855 7.20113 1.75753 7.41022 1.53868C7.6193 1.31984 7.9047 1.19002 8.20706 1.17622H19.633C19.9905 1.17611 20.3432 1.2575 20.6645 1.4142C20.9857 1.57089 21.267 1.79876 21.487 2.0805C21.7069 2.36223 21.8598 2.6904 21.9339 3.04007C22.008 3.38974 22.0013 3.7517 21.9145 4.09843L20.1514 11.1509C20.0243 11.6597 19.7307 12.1115 19.3173 12.4343C18.9039 12.7571 18.3944 12.9324 17.8699 12.9323H8.68513C7.61503 12.9325 6.57689 12.5676 5.74215 11.898C4.90741 11.2285 4.32601 10.2942 4.09396 9.24959L2.56071 2.35122H1.15341Z'
        />
    ),
})

const historySvg = createIcon({
    displayName: 'MySvgIcon',
    viewBox: '0 0 512 512',
    path: (
        <React.Fragment>
            <path
                fill='#F7B23B'
                d='M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z'
            />
        </React.Fragment>
    ),
})

const exitSvg = createIcon({
    displayName: 'MySvgIcon',
    viewBox: '0 0 24 24',
    path: (
        <React.Fragment>
            <path
                fill='#F7B23B'
                d='M16 4H19C20.1046 4 21 4.89543 21 6V7M16 20H19C20.1046 20 21 19.1046 21 18V17M4.4253 19.4276L10.4253 21.2276C11.7085 21.6126 13 20.6517 13 19.3119V4.68806C13 3.34834 11.7085 2.38744 10.4253 2.77241L4.4253 4.57241C3.57934 4.8262 3 5.60484 3 6.48806V17.5119C3 18.3952 3.57934 19.1738 4.4253 19.4276Z'
                stroke='black'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
            />
            <path
                fill='#F7B23B'
                d='M9.001 12H9'
                stroke='black'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
            />
            <path
                fill='#F7B23B'
                d='M16 12H21M21 12L19 10M21 12L19 14'
                stroke='black'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
            />
        </React.Fragment>
    ),
})

const MobileNavbar = () => {
    const navigate = useNavigate()

    const handleLogOut = () => {
        window.localStorage.removeItem('authToken')
        navigate(LOGIN_ROUTE, { replace: true })
    }

    return (
        <Box
            position='absolute'
            bottom={0}
            backgroundColor='white'
            // dropShadow={'2px -5px 15px 0'}
            borderTopLeftRadius={15}
            borderTopRightRadius={15}
            boxShadow='2px 2px 15px #e3e3e3'
            width='100%'
            p={3}
            display='flex'
            flexDirection='row'
            justifyContent='space-evenly'
            zIndex={10}
        >
            <Box
                cursor='pointer'
                textAlign='center'
                onClick={() => navigate(SALES_REQUEST_FORM_ROUTE)}
            >
                <Icon as={MySvgIcon} boxSize={8} color='red.500' />
                <Text fontWeight='bold'>Заказ</Text>
            </Box>
            <Box cursor='pointer' textAlign='center' onClick={() => navigate(SALES_HISTORY_ROUTE)}>
                <Icon as={historySvg} boxSize={8} color='red.500' />
                <Text fontWeight='bold'>История</Text>
            </Box>
            <Box cursor='pointer' textAlign='center' onClick={handleLogOut}>
                <Icon as={exitSvg} boxSize={8} color='red.500' />
                <Text fontWeight='bold'>Выход</Text>
            </Box>
        </Box>
    )
}

export default MobileNavbar
