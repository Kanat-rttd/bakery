import $host from './axios'

export const getAllRequests = async () => {
    const { data } = await $host.get('requests')
    return data
}

type RequestDataItem = {
    name: number
    bakeryType: number
    quantity: number
}

export const createRequest = async (data: RequestDataItem[]) => {
    try {
        const response = await $host.post('requests', data)
        return response.data
    } catch (error) {
        console.error(error)
        throw error
    }
}
