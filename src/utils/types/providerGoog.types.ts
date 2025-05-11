export type ProviderGoodsType = {
    id: number
    providerId: number
    goodsCategoryId: number
    goodsCategory: {
        id: number
        unitOfMeasure: string
    }
    goods: string
    place: string
    status: string
    provider: {
        id: number
        name: string
    }
}

export type ProviderInputs = {
    id: number
    providerId: number
    goodsCategoryId: number
    goods: string
    bakery: { label: string }[]
    status: string
}
