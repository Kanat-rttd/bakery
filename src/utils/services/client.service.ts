import $host from './axios'

// export const getAllClients = async () => {
//     const { data } = await $host.get('client')
//     return data
// }
//TODO: Нет смысла обьект
export const getAllClients = async (filters: {
    name: string
    telegrammId: string
    status: string
}) => {
    const { data } = await $host.get('client', {
        params: { filters },
    })
    return data
}

export const getAllClientsFilter = async () => {
    const { data } = await $host.get('client', {
        params: {},
    })
    return data
}

export const createClient = async (data: {
    name: string
    surname: string
    contact: string
    telegrammId: string
    status: boolean
    password: string
}) => {
    const response = await $host.post('client', data)
    return response
}

export const updateClient = async (
    id: number,
    data: {
        name: string
        surname: string
        contact: string
        telegrammId: string
        status: boolean
        password: string
    },
) => {
    const response = await $host.put(`client/${id}`, data)
    return response
}

export const findByFilters = async (data: {
    name: string
    telegrammId: string
    status: boolean
}) => {
    const response = await $host.post('client/find', data)
    return response
}

export const deleteClient = async (id: number) => {
    const response = await $host.delete(`client/${id}`)
    return response
}
