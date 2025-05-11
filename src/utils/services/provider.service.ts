import $host from './axios'

export const createProvider = async (data: { providerName: string; status: boolean }) => {
    const response = await $host.post('providers', data)
    return response
}

export const updateProvider = async (
    id: number,
    data: {
        providerName: string
        status: boolean
    },
) => {
    const response = await $host.put(`providers/${id}`, data)
    return response
}

export const deleteProvider = async (id: number) => {
    const response = await $host.delete(`providers/${id}`)
    return response
}
