import $host from './axios'

export const getAllFinancesCategories = async () => {
    const { data } = await $host.get('financeCategories')
    return data
}
