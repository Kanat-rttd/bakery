import { Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { TableContainer, Thead } from '@/components/ui'
import { DispatchType } from '@/utils/types/dispatch.types'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import { useNotify } from '@/utils/hooks/useNotify.ts'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'

interface PivotTableProps {
    status: string
}

type Dispatch = {
    data: DispatchType[]
    totalPrice: number
    totalQuantity: number
}

const PivotTable = forwardRef(({ status }: PivotTableProps, ref) => {
    const { getURLs, getParam } = useURLParameters()
    const [data, setData] = useState<DispatchType[]>([])
    const [headers, setHeaders] = useState<{ bread: string }[]>([])
    const { error } = useNotify()

    const { data: dispatchesData } = useApi<Dispatch>(
        `release?${getURLs().toString()}&status=${status}`,
    )

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })
    const [modal, setModal] = useState({
        isOpen: false,
        onClose: () => setModal({ ...modal, isOpen: false }),
    })

    useEffect(() => {
        if (!dispatchesData) return

        const uniqueProductNames = [
            ...new Set(
                dispatchesData.data
                    .filter((row: DispatchType) => row.dispatch == Number(status))
                    .flatMap((item: DispatchType) =>
                        item.goodsDispatchDetails.map((detail) => detail.product.name),
                    ),
            ),
        ]
        const headers = uniqueProductNames.map((name) => ({ bread: name }))

        setHeaders(headers)
        setData(dispatchesData.data.filter((row: DispatchType) => row.dispatch == Number(status)))
    }, [dispatchesData])

    useImperativeHandle(ref, () => ({
        async export() {
            if (!data || !data.length) {
                return error('Нет данных для экспорта')
            }

            const formatted = data
                .sort((a, b) => a.id - b.id)
                .map((item, idx) => [
                    idx + 1,
                    item.contragent.contragentName,
                    ...headers.map(
                        (header) =>
                            item.goodsDispatchDetails.find(
                                (detail) => detail.product.name === header.bread,
                            )?.quantity || 0,
                    ),
                ])

            const startDate = new Date(getParam('startDate')).toLocaleDateString()
            const endDate = new Date(getParam('endDate')).toLocaleDateString()

            await generateExcel(`Выдача с ${startDate} по ${endDate}`, [
                ['№', 'Реализатор', ...headers.map((h) => h.bread)],
                ...formatted,
            ])
        },
    }))

    return (
        <>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th>№</Th>
                            <Th>Реализатор</Th>
                            {headers.map((head) => (
                                <Th key={head.bread}>{head.bread}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.length ? (
                            data
                                .sort((a, b) => a.id - b.id)
                                .map((row, index) => (
                                    <Tr key={row.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{row.contragent.contragentName}</Td>
                                        {headers.map((header, index) => {
                                            const quantity = row.goodsDispatchDetails.find(
                                                (detail) => detail.product.name === header.bread,
                                            )?.quantity
                                            return <Td key={index}>{quantity || 0}</Td>
                                        })}
                                    </Tr>
                                ))
                        ) : (
                            <Tr>
                                <Td>Нет данных</Td>
                                <Td></Td>
                                {headers.map((_, index) => (
                                    <Th key={index}></Th>
                                ))}
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    )
})

export default PivotTable
