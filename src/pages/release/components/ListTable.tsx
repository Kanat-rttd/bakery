import Dialog from '@/components/Dialog'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { IconButton, Table, Tbody, Td, Th, Tr, useDisclosure } from '@chakra-ui/react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import dayjs from 'dayjs'
import { useApi } from '@/utils/services/axios'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Thead } from '@/components/ui'
import { useNotify } from '@/utils/hooks/useNotify'
import { deleteDispatch } from '@/utils/services/dispatch.service'
import { DispatchType } from '@/utils/types/dispatch.types'
import DistributionModal from './DistributionModal'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'

export interface ListTableProps {
    status: string
}

type Dispatch = {
    data: DispatchType[]
    totalPrice: number
    totalQuantity: number
}

const ListTable = forwardRef(({ status }: ListTableProps, ref) => {
    const { loading } = useNotify()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { getURLs, getParam } = useURLParameters()

    const [selectedData, setSelectedData] = useState<DispatchType>()
    const { error } = useNotify()

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const { data: dispatchesData, mutate: mutateDispatchesData } = useApi<Dispatch>(
        `release?${getURLs().toString()}&status=${status}`,
    )

    const handlerDelete = async (selectedData: DispatchType | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteDispatch(selectedData.id)
            loading(responsePromise)
            await responsePromise
            await mutateDispatchesData()
        } else {
            console.error('No data available to delete.')
        }
    }

    const onSuccess = async () => {
        await mutateDispatchesData()
        setSelectedData(undefined)
    }

    useImperativeHandle(ref, () => ({
        async export() {
            if (!dispatchesData || !dispatchesData.data.length) {
                return error('Нет данных для экспорта')
            }

            const headers = ['№', 'Дата и время', 'Реализатор', 'Вид хлеба', 'Количество']
            const data: any[][] = []

            let idx = 1

            dispatchesData.data.forEach((item) =>
                item.goodsDispatchDetails.forEach((detail) => {
                    data.push([
                        idx,
                        new Date(item.createdAt).toLocaleDateString(),
                        item.contragent.contragentName,
                        detail.product.name,
                        detail.quantity,
                    ])
                    idx++
                }),
            )

            const startDate = new Date(getParam('startDate')).toLocaleDateString()
            const endDate = new Date(getParam('endDate')).toLocaleDateString()

            await generateExcel(`Возврат с ${startDate} по ${endDate}`, [headers, ...data])
        },
    }))

    return (
        <>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th>№</Th>
                            <Th>Реализатор</Th>
                            <Th>Виды хлеба</Th>
                            <Th>Количество </Th>
                            <Th>Дата и время</Th>
                            <Th className='print-hidden'>Действия</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dispatchesData?.data.length ? (
                            dispatchesData?.data
                                .sort((a, b) => a.id - b.id)
                                .map((row, index) => {
                                    return (
                                        <Tr key={row.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{row.contragent.contragentName}</Td>
                                            <Td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    {row.goodsDispatchDetails.map((details) => (
                                                        <span key={details.id}>
                                                            {details.product &&
                                                                details.product.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Td>
                                            <Td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    {row.goodsDispatchDetails.map(
                                                        (details, index) => (
                                                            <span key={index}>
                                                                {details.quantity}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </Td>
                                            <Td>
                                                {dayjs(row.createdAt).format('HH:mm DD.MM.YYYY')}
                                            </Td>
                                            <Td className='print-hidden'>
                                                <IconButton
                                                    variant='outline'
                                                    size='sm'
                                                    colorScheme='teal'
                                                    aria-label='Send email'
                                                    marginRight={3}
                                                    onClick={() => {
                                                        setSelectedData(row)
                                                        onOpen()
                                                    }}
                                                    icon={<EditIcon />}
                                                />
                                                <IconButton
                                                    variant='outline'
                                                    size='sm'
                                                    colorScheme='teal'
                                                    aria-label='Send email'
                                                    marginRight={3}
                                                    onClick={() => {
                                                        setSelectedData(row)
                                                        setDialog({
                                                            ...dialog,
                                                            isOpen: true,
                                                        })
                                                    }}
                                                    icon={<DeleteIcon />}
                                                />
                                            </Td>
                                        </Tr>
                                    )
                                })
                        ) : (
                            <Tr>
                                <Td>Нет данных</Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                                <Td></Td>
                            </Tr>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            {isOpen && (
                <DistributionModal
                    isOpen={isOpen}
                    onClose={onClose}
                    data={selectedData}
                    onSuccess={onSuccess}
                    status={status}
                />
            )}
            <Dialog
                isOpen={dialog.isOpen}
                onClose={dialog.onClose}
                header='Удалить'
                body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                actionBtn={async () => {
                    dialog.onClose()
                    await handlerDelete(selectedData)
                }}
                actionText='Удалить'
            />
        </>
    )
})
export default ListTable
