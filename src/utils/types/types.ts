interface Product {
    productName: string
    quantity: number
}

export interface Order {
    name: string
    products: Product[]
    done: boolean
    total: number
}

export interface ClientList {
    id: number
    name: string
    email: string
}

export interface ProductList {
    id: number
    name: string
    bakeryType: string
    bakingFacilityUnit?: {
        facilityUnit: string
    }
}

export interface OrderArray extends Array<Order> {}
