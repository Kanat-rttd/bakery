export interface Product {
    id: number
    name: string
    price: number
    costPrice: number
    status: string
    bakingFacilityUnit: FacilityUnit
}

export interface ProductForSend {
    name: string
    bakingFacilityUnitId?: string
    price: number
    costPrice: number
    status: string
}

export interface FacilityUnit {
    id: number
    facilityUnit: string
}
