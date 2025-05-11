import $host from '@/utils/services/axios.ts'
import dayjs from 'dayjs'

export const generateExcel = async (sheetName: string, data: unknown[][]) => {
    const response = await $host.post(
        '/spreadsheet/export',
        { data, sheetName },
        { responseType: 'blob' },
    )
    const blob = response.data
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `${sheetName} ${dayjs().format('DD-MM-YYYY')}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.parentElement?.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
}
