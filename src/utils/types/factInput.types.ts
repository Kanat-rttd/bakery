export type FactInputType = {
    data: FactInputTableData[]
    totalFact: number
}

export type FactInputTableData = {
    id: number
    goodsCategoryId: number
    goodsCategory: {
        id: number
        category: string
        unitOfMeasure: string
    }
    place: string
    quantity: number
    updatedAt: string
}

export type AddFactModalInputs = {
    id: number
    name: string
    place: string
    unitOfMeasure: string
    quantity: string
    updatedAt: string
}
