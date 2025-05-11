import $host from './axios'

export const getAllPruchases = async () => {
    const { data } = await $host.get('productPurchase')
    return data
}

export const createPurchase = async (data: {
    quantity: number
    price: number
    deliverySum: number
    date: Date | string
    providerId: number
    providerGoodId: number | undefined
    goodsCategoryId: number | undefined
    status?: { value: number; label: string } | string | undefined
}) => {
    const response = await $host.post('productPurchase', data)
    return response
}

export const updatePurchase = async (
    id: string,
    data: {
        quantity: number
        price: number
        deliverySum: number
        date: string
        providerId: number
        providerGoodId: number | undefined
        goodsCategoryId: number | undefined
        status?: { value: number; label: string } | string | undefined
    },
) => {
    const response = await $host.put(`productPurchase/${id}`, data)
    return response
}

export const deletePurchase = async (id: number) => {
    const response = await $host.delete(`productPurchase/${id}`)
    return response
}
