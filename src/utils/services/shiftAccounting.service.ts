import $host from './axios'

export const getAllShiftAccounting = async () => {
    const { data } = await $host.get('shiftAccounting')
    return data
}

export const createShiftAccounting = async (data: {
    facilityUnitsId: string
    date: Date
    departPersonals: {
        name: string
        id: number
        hours: number
    }[]
}) => {
    const response = await $host.post('shiftAccounting', data)
    return response
}

export const updateShiftAccounting = async (
    id: string,
    data:
        | {
              date: string
              shiftAccountingDetailsId: number
              shiftAccountingId: number
              departPersonalId: number
              shiftTime: string
          }[]
        | undefined,
) => {
    const response = await $host.put(`shiftAccounting/${id}`, data)
    return response
}

export const deleteShiftAccounting = async (id: number) => {
    const response = await $host.put(`shiftAccounting/delete/${id}`)
    return response
}
