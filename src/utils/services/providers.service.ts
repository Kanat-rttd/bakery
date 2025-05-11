import $host from './axios'

export const getAllProviders = async () => {
    const { data } = await $host.get('providers')
    return data
}
