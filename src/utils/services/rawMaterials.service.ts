import $host from './axios'

export const getAllRawMaterials = async () => {
    const { data } = await $host.get('rawMaterials')
    return data
}
