import $host from './axios'

const route = 'goodsCategories'

export const getAllGoodsCategories = async (categoryId: number) => {
    const { data } = await $host.get(route, { params: { categoryId } })

    return data
}

export const createGoodsCategory = async (data: { category: string; unitOfMeasure: string }) => {
    return await $host.post(route, data)
}

export const updateGoodsCategory = async (
    id: number,
    data: { category: string; unitOfMeasure: string },
) => {
    return await $host.put(`${route}/${id}`, data)
}

export const deleteGoodsCategory = async (id: number) => {
    return await $host.delete(`${route}/${id}`)
}

