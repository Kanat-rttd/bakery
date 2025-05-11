import $host from './axios'

export const createDebtTransfer = async (data: {
    summa: string
    date: Date
    comment: string
    from: number
    to: number
    invoiceNumber: number
}) => {
    const response = await $host.post('debtTransfer', data)
    return response
}

export const getAllDebtTransfer = async () => {
    const { data } = await $host.get('debtTransfer')
    return data
}

export const getAllCalculations = async () => {
    const { data } = await $host.get('debtTransfer/calculations')
    return data
}
