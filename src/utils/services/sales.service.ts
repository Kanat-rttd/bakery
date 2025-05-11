import $host from './axios'

export const getAllSales = async () => {
    const { data } = await $host.get('sales')
    return data
}

export const createSale = async (data: {
    products: { productId: number | null; orderedQuantity: number | null }[]
    date: Date
    clientId: number
}) => {
    return await $host.post('sales', data)
}

export const updateSale = async (
    id: number,
    data: {
        products: { productId: number | null; orderedQuantity: number | null }[]
        date: Date
        clientId: number
    },
) => {
    return await $host.put(`sales/${id}`, data)
}

export const saveOrderChanges = async (
    id: number,
    data: {
        orderDetailsId: number
        productId: number
        orderedQuantity: number
        product: {
            name: string
            price: number
        }
    }[],
) => {
    return await $host.put(`sales/order/${id}`, data)
}

export const deleteSale = async (id: number) => {
    return await $host.delete(`sales/${id}`)
}

export const getSaleById = async (id: number) => {
    const { data } = await $host.get(`sales/${id}`)
    return data
}

export const setDoneStatus = async (id: number) => {
    return await $host.put(`sales/status/${id}`)
}

export const getByFacilityUnit = async (data: { facilityUnitId: string }) => {
    return await $host.post('sales/status/test', data)
}

export const getByClient = async () => {
    const res = await $host.get(`sales/client`)
    console.log(res)
    return res.data
}
