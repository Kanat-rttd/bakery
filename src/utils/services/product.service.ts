import $host from './axios'

export const getAllProducts = async () => {
    const { data } = await $host.get('product')
    return data
}

export const getBreadNames = async () => {
    const { data } = await $host.get('product/bread')
    return data
}

export const createProduct = async (data: {
    name: string
    bakingFacilityUnitId?: string
    price: number
    costPrice: number
    status: boolean
}) => {
    const response = await $host.post('product', data)
    return response
}

export const findByFilters = async (data: {
    name: string
    bakingFacilityUnitId: string
    status: string
}) => {
    const response = await $host.post('product/find', data)
    return response
}

export const updateProduct = async (
    id: number,
    data: {
        name: string
        bakingFacilityUnitId?: string
        price: number
        costPrice: number
        status: boolean
    },
) => {
    const response = await $host.put(`product/${id}`, data)
    return response
}

export const deleteProduct = async (id: number) => {
    const response = await $host.delete(`product/${id}`)
    return response
}
