export type PurchaseType = {
    id: number
    date: string
    deliverySum: number
    goodsCategoryId: number
    goodsCategory: {
        id: number
        name: string
        unitOfMeasure: string
    }
    price: number
    providerId: number
    provider: {
        id: number
        providerName: string
    }
    providerGoodId: number
    quantity: number
    status: string
    totalSum: number
    providerGood: {
        id: number
        goods: string
    }
}
