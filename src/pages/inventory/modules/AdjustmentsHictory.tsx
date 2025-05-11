import { Table, Tr, Th, Tbody, Td, Box, Select, Tooltip, Button } from '@chakra-ui/react'
import { TableContainer, Thead } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useApi } from '@/utils/services/axios'
import dayjs from 'dayjs'
import { useNotify } from '@/utils/hooks/useNotify.ts'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { useURLParameters } from '@/utils/hooks/useURLParameters.tsx'

type AdjustmentType = {
    quantity: number
    goodsCategoryId: number
    createdAt: Date
    comment: string
    goodsCategory: {
        id: number
        category: string
        unitOfMeaseure: string
    }
}

type GoodsCategoryType = {
    id: number
    category: string
    unitOfMeasure: string
}

const AdjustmentsHictory = () => {
    const { getParam, setParam, getURLs } = useURLParameters()
    const { error } = useNotify()

    const { data: goodsCategoriesData } = useApi<GoodsCategoryType[]>('goodsCategories')
    const { data: adjustmentData } = useApi<AdjustmentType[]>(`adjustment?${getURLs().toString()}`)

    const exportExcel = async () => {
        if (!adjustmentData || adjustmentData.length === 0) {
            return error('Нет данных для экспорта')
        }

        const headers = ['№', 'Дата', 'Категория товара', 'Количество', 'Комментарий']
        const data = [
            headers,
            ...adjustmentData.map((item, idx) => [
                idx + 1,
                new Date(item.createdAt).toLocaleDateString(),
                item.goodsCategory.category,
                item.quantity,
                item.comment,
            ]),
        ]

        await generateExcel('История корректировок', data)
    }

    return (
        <>
            <UniversalComponent>
                <Box display='flex' flexDirection='column' p={5} mt={1}>
                    <Box
                        className='print-hidden'
                        marginBottom={5}
                        display='flex'
                        justifyContent='space-between'
                    >
                        <Box width='100%' display='flex' gap='15px'>
                            <Select
                                placeholder='Все товары'
                                width='20%'
                                size='sm'
                                borderRadius={5}
                                value={getParam('goodsCategoryId')}
                                onChange={(e) => setParam('goodsCategoryId', e.target.value)}
                            >
                                {goodsCategoriesData?.map((item, index) => (
                                    <option key={index} value={item.id}>
                                        {item.category}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                        <Box display='flex' gap='15px'>
                            <Button size='sm' type='button' onClick={exportExcel}>
                                Экспорт в Excel
                            </Button>
                            <Button size='sm' type='button' onClick={() => window.print()}>
                                Экспорт в PDF
                            </Button>
                        </Box>
                    </Box>
                    <TableContainer style={{ width: '100%', overflowY: 'auto' }}>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>№</Th>
                                    <Th>Дата</Th>
                                    <Th>Категория товара</Th>
                                    <Th>Количество</Th>
                                    <Th maxWidth='200px'>Комментарий</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {adjustmentData?.length ? (
                                    adjustmentData?.map((item, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>
                                                    {dayjs(item.createdAt).format('DD.MM.YYYY')}
                                                </Td>
                                                <Td>{item.goodsCategory.category}</Td>
                                                <Td>{item.quantity}</Td>
                                                <Td maxWidth='200px'>
                                                    <Tooltip label={item.comment}>
                                                        <Box
                                                            overflow='hidden'
                                                            whiteSpace='nowrap'
                                                            cursor='pointer'
                                                            textOverflow='ellipsis'
                                                        >
                                                            {item.comment}
                                                        </Box>
                                                    </Tooltip>
                                                </Td>
                                            </Tr>
                                        )
                                    })
                                ) : (
                                    <Tr>
                                        <Td>Нет данных</Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </UniversalComponent>
        </>
    )
}

export default AdjustmentsHictory
