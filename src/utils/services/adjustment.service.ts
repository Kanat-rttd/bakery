import { ProviderGoodsType } from '../types/providerGoog.types'
import $host from './axios'

export const createAdjustment = async (data: {
    qty: number
    Comment: string
    item: ProviderGoodsType
}) => {
    const response = await $host.post('adjustment', data)
    return response
}
