export type OverPriceType = {
    id: number
    price: string
    contragentId: number
    month: string
    year: string
    isDeleted: number
    contragent: {
        id: number
        contragentName: string
    }
}

export type OverPriceInputs = {
    contragentId: number
    month: string
    year: string
    price: string
}
