import $host from './axios'

export const getAllFactInputs = async () => {
    const { data } = await $host.get('factInput')
    return data
}

export const createFactInput = async (data: {
    place: string
    details: {
        goodsCategoryId: number | null
        quantity: number | null
        unitOfMeasure: string | null
    }[]
}) => {
    const response = await $host.post('factInput', data)
    return response
}

export const updateFactInput = async (
    id: number | undefined,
    data: {
        name: string
        place: string
        quantity: number
    },
) => {
    const response = await $host.put(`factInput/${id}`, data)
    return response
}

export const deleteFactInput = async (id: number | undefined) => {
    const response = await $host.delete(`factInput/${id}`)
    return response
}
