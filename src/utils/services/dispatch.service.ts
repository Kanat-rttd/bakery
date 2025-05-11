import $host from './axios'

export const getAllDispatches = async () => {
    const { data } = await $host.get('release')
    return data
}

export const createDispatch = async (data: {
    contragentId: number
    products: {
        productId: number | null
        quantity: number | null
        productPrice: number | undefined
    }[]
    dispatch: string
}) => {
    const response = await $host.post('release', data)
    return response
}

export const getInvoiceData = async () => {
    const { data } = await $host.get('release/invoice')
    return data
}

export const updateDispatchQuantity = async (
    id: number,
    data: {
        contragentId: number
        products: { productId: number | null; quantity: number | null; price: number | undefined }[]
    },
) => {
    const response = await $host.put(`release/${id}`, data)
    return response
}

export const updateDispatchPrice = async (
    id: number,
    data: {
        contragentId: number
        products: { productId: number; quantity: number; price: number }[]
    },
) => {
    const response = await $host.put(`release/${id}`, data)
    return response
}

export const deleteDispatch = async (id: number) => {
    const response = await $host.put(`release/delete/${id}`)
    return response
}

export const moveDateDispatch = async (startDate: string, endDate: string, newDate: string) => {
    return await $host.put(
        'release/changeDate',
        { newDate },
        {
            params: { startDate, endDate },
        },
    )
}

// export const getSaleById = async (id: number) => {
//     const { data } = await $host.get(`sales/${id}`)
//     return data
// }

// export const setDoneStatus = async (id: number) => {
//     const response = await $host.put(`sales/status/${id}`)
//     return response
// }

// export const getByFacilityUnit = async (data: { facilityUnitId: string }) => {
//     const response = await $host.post('sales/status/test', data)
//     return response
// }
