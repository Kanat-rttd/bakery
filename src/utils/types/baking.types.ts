export type BakingDataType = {
    id: number
    breadType: string
    output: string
    defective: string
    dateTime: string
    bakingDetails: BakingDetailType[]
    product?: {
        name: string
        id: string
    }
    flour: BakingDetailType
    salt: BakingDetailType
    yeast: BakingDetailType
    malt: BakingDetailType
    butter: BakingDetailType
}

export type BakingDetailType = {
    // bakingId: number
    goodsCategoryId: number
    // id: number
    quantity: number | undefined
}

export type BakingType = {
    bakingData: BakingDataType[]
    totals: BakingTotalsType
}

export type BakingTotalsType = {
    totalButter: number
    totalFlour: number
    totalMalt: number
    totalOutput: number
    totalSalt: number
    totalYeast: number
    totalDefective: number
}
