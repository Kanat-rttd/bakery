import axios from 'axios'
import useSWR, { mutate } from 'swr'

const $host = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
})

$host.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
        config.headers['authorization'] = `Bearer ${token}`
    }
    return config
})

// export const fetcher = async (url: string) => {
//     const response = await $host.get(url)
//     return response.data
// }

export const fetcher = async (url: string, params?: unknown) => {
    const response = await $host.get(url, { params })
    return response.data
}
// export function useApi<T>(url: string) {
//     const { data, error, mutate, isLoading } = useSWR<T>(url, fetcher)
//     return {
//         loading: !error && !data,
//         data,
//         isLoading,
//         error,
//         mutate,
//     }
// }

export function useApi<T>(url: string, queryParams?: Record<string, string>) {
    const queryString = queryParams ? new URLSearchParams(queryParams).toString() : ''
    const fullUrl = queryString ? `${url}?${queryString}` : url

    const { data, error, mutate, isLoading } = useSWR<T>(fullUrl, fetcher)

    return {
        loading: !error && !data,
        data,
        isLoading,
        error,
        mutate,
    }
}

export { mutate }
export default $host
