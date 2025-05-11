export type UniquePriceType = {
    clientId: string
    clientName: string
    detail: UniquePriceDetail[]
}

export type UniquePriceDetail = {
    individualPriceId: string
    id: string
    name: string
    price: string
    date: Date
}
