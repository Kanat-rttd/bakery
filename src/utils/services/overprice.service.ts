import $host from './axios'

export const getAllOverprices = async () => {
    const { data } = await $host.get('overPrice')
    return data
}

export const createOverprice = async (data: {
    contragentId: number
    month: string
    year: string
    price: string
}) => {
    const requestData = {
        data: data,
    }
    const response = await $host.post('overPrice', requestData)
    return response
}

export const updateOverprice = async (
    id: number,
    data: { contragentId: number; month: string; year: string; price: string },
) => {
    const response = await $host.put(`overPrice/${id}`, data)
    return response
}

export const deleteOverprice = async (id: number) => {
    const response = await $host.delete(`overPrice/${id}`)
    return response
}
