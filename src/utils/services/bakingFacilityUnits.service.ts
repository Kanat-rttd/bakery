import $host from './axios'

export const getAllBakingFacilityUnits = async () => {
    const { data } = await $host.get('mixers')
    return data
}

export const createFacilityUnit = async (data: { facilityUnit: string }) => {
    const response = await $host.post('mixers', data)
    return response
}
