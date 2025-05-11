export type OrderArrayType = {
    id: number
    userId: string
    totalQuantity: string
    createdAt: Date
    done: number
    date: Date
    orderDetails: [
        {
            orderDetailsId: string
            productId: string
            orderedQuantity: string
            product: {
                name: string
                price: string
            }
        },
    ]
    user: {
        id: string
        name: string
    }
    client: {
        id: string
        name: string
    }
}
