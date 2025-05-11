import { PathString } from 'react-hook-form'
import $host from './axios'

export const getAllBakings = async () => {
    const { data } = await $host.get('baking')
    return data
}

export const createBaking = async (data: {
    breadType: string
    dateTime: string
    output: string
    defective: string
    bakingDetails: {
        goodsCategoryId: number
        quantity: number | undefined
    }[]
}) => {
    const response = await $host.post('baking', data)
    return response
}

export const updateBaking = async (
    id: number,
    data: {
        breadType: PathString
        dateTime: string
        output: string
        defective: string
        bakingDetails: {
            goodsCategoryId: number
            quantity: number | undefined
        }[]
    },
) => {
    const response = await $host.put(`baking/${id}`, data)
    return response
}

export const deleteBaking = async (id: number) => {
    const response = await $host.delete(`baking/${id}`)
    return response
}
