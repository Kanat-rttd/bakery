export type individualPriceType = {
    clientId: string
    clientName: string
    detail: individualPriceDetail[]
}

export type individualPriceDetail = {
    individualPriceId: string
    id: string
    name: string
    price: string
    date: Date
}
