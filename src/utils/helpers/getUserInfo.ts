import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
    userId: string
    clientId: string
    email: string
    phone: number
    class: string
    iat: number
    exp: number
}

export default function getUserInfo() {
    try {
        const token = localStorage.getItem('authToken')

        if (token === null) {
            window.location.href = '/login'
            return null
        }

        const decodedToken: DecodedToken = jwtDecode(token)

        return decodedToken
    } catch (error) {
        console.error(error)
    }
}
