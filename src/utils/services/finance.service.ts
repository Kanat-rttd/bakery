import $host from './axios'

export const getAllFinances = async (sortOrder = '') => {
    const { data } = await $host.get('finance', { params: { sortOrder } })
    return data
}

export const getFinanceAmountByInvoiceNumber = async (invoiceNumber: number) => {
    const { data } = await $host.get(`finance/${invoiceNumber}`)
    return data
}

export const getAllTotalsWithInvoiceNumbers = async () => {
    const { data } = await $host.get(`finance/totals`)
    return data
}

export const getReportData = async () => {
    const { data } = await $host.get('finance/report')
    return data
}

export const createArrival = async (data: {
    financeAccountId: number
    amount: number | null
    financeCategoryId: number | undefined
    contragentId: number | undefined
    comment: string
    date: Date
}) => {
    const requestData = {
        data: data,
    }
    return await $host.post('finance/arrival', requestData)
}

export const createInvoiceArrival = async (
    invoiceNumber: number | undefined,
    data: {
        financeAccountId: number
        amount: number | null
        financeCategoryId: number | undefined
        contragentId: number | undefined
        comment: string
        date: Date
    },
) => {
    const requestData = {
        invoiceNumber: invoiceNumber,
        data: data,
    }

    return await $host.post('finance/arrival', requestData)
}

export const createConsumption = async (data: {
    financeAccountId: number
    amount: number | null
    financeCategoryId: number | undefined
    contragentId: number | undefined
    comment: string
    date: Date
}) => {
    const requestData = {
        data: data,
    }
    return await $host.post('finance/consumption', requestData)
}

export const createTransfer = async (data: {
    fromAccountId: number
    toAccountId: number
    date: Date
    comment: string
    amount: number | null
}) => {
    const requestData = {
        data: data,
    }
    return await $host.post('finance/transfer', requestData)
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

export const deleteFinance = async (id: number) => {
    return await $host.delete(`finance/${id}`)
}
