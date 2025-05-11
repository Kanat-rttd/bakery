import Dialog from '@/components/Dialog'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Table, Tbody, Td, Th, Tr, useDisclosure, IconButton } from '@chakra-ui/react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import EditModal from './EditModal'
// import { mutate } from 'swr'
import { useApi } from '@/utils/services/axios'
import { deleteDispatch } from '@/utils/services/dispatch.service'
import { useNotify } from '@/utils/hooks/useNotify'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import dayjs from 'dayjs'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import UniversalComponent from '@/components/ui/UniversalComponent.tsx'

interface DispatchData {
    data: DispatchType[]
    totalPrice: number
    totalQuantity: number
}

interface DispatchType {
    id: number
    contragentId: number
    createdAt: string
    dispatch: string
    goodsDispatchDetails: {
        id: number
        productId: number
        quantity: number
        price: number
        product: {
            name: string
            price: number
            bakingFacilityUnit: {
                id: number
                facilityUnit: string
            }
        }
    }[]
    contragent: {
        id: number
        contragentName: string
    }
}

const ListTable = forwardRef((_props, ref) => {
    const { getURLs, getParam } = useURLParameters()
    const { loading, error } = useNotify()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [selectedRow, setSelectedRow] = useState<DispatchType | null>(null)

    const { data: dispatchData, mutate: mutateDispatchData } = useApi<DispatchData>(
        `release?${getURLs().toString()}&status=0`,
    )

    const [modal, setModal] = useState({
        isOpen: false,
        onClose: () => setModal({ ...modal, isOpen: false }),
    })

    const handleEditClick = (row: DispatchType) => {
        setSelectedRow(row)
        setModal({ ...modal, isOpen: true })
    }

    const handleModalClose = () => {
        setSelectedRow(null)
        setModal({ ...modal, isOpen: false })
    }

    const handleSuccess = async () => {
        await mutateDispatchData()
    }

    const handlerDeleteUser = async () => {
        if (selectedRow) {
            const responsePromise: Promise<any> = deleteDispatch(selectedRow.id)
            loading(responsePromise)
            await responsePromise
            await mutateDispatchData()
            onClose()
        } else {
            console.error('No user data available to delete.')
        }
    }

    useImperativeHandle(ref, () => ({
        async export() {
            if (!dispatchData || dispatchData.data.length === 0) {
                return error('Нет данных для экспорта')
            }

            const data = [['№', 'Дата', 'Реализатор', 'Продукт', 'Количество', 'Цена', 'Сумма']]
            const startDate = new Date(getParam('startDate')).toLocaleDateString()
            const endDate = new Date(getParam('endDate')).toLocaleDateString()

            let idx = 1

            dispatchData.data.forEach((item) => {
                item.goodsDispatchDetails.forEach((detail) => {
                    data.push([
                        idx.toString(),
                        new Date(item.createdAt).toLocaleDateString(),
                        item.contragent.contragentName,
                        detail.product.name,
                        detail.quantity.toString(),
                        detail.price.toString(),
                        (Number(detail.price) * Number(detail.quantity)).toString(),
                    ])
                    idx++
                })
            })

            data.push([
                '',
                'ИТОГО',
                '',
                '',
                dispatchData.totalQuantity.toString(),
                '',
                dispatchData.totalPrice.toString(),
            ])

            await generateExcel(`Журнал продаж с ${startDate} по ${endDate}`, data)
        },
    }))

    return (
        <UniversalComponent>
            <TableContainer overflowY='auto'>
                <Table variant='simple'>
                    <Thead>
                        <Tr position='sticky' top={0} backgroundColor='white' zIndex={9}>
                            <Th textAlign='center'>№</Th>
                            <Th textAlign='center'>Дата</Th>
                            <Th>Реализатор</Th>
                            <Th>Продукт</Th>
                            <Th>Количество </Th>
                            <Th>Цена</Th>
                            <Th>Сумма</Th>
                            <Th className='print-hidden'>Действия</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {dispatchData?.data.length ? (
                            dispatchData?.data
                                ?.filter((row: DispatchType) => row.dispatch == status)
                                ?.map((row, index) => {
                                    return (
                                        <Tr textAlign='center' key={row.id}>
                                            <Td textAlign='center'>{index + 1}</Td>
                                            <Td textAlign='center'>
                                                {dayjs(row.createdAt).format('HH:mm DD.MM.YYYY')}
                                            </Td>
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
                                                            {details.product.name}
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
                                                                {details.quantity.formatted()}
                                                            </span>
                                                        ),
                                                    )}
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
                                                                {Number(details.price).formatted()}
                                                            </span>
                                                        ),
                                                    )}
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
                                                                {(
                                                                    Number(details.price) *
                                                                    Number(details.quantity)
                                                                ).formatted()}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </Td>
                                            <Td className='print-hidden'>
                                                <IconButton
                                                    variant='outline'
                                                    size='sm'
                                                    colorScheme='teal'
                                                    aria-label='Send email'
                                                    marginRight={3}
                                                    onClick={() => {
                                                        handleEditClick(row)
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
                                                        setSelectedRow(row)
                                                        onOpen()
                                                    }}
                                                    icon={<DeleteIcon />}
                                                />
                                            </Td>
                                        </Tr>
                                    )
                                })
                        ) : (
                            <Tr>
                                <Th>Нет данных</Th>
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th fontSize={15} color='#000'>
                                ИТОГО
                            </Th>
                            <Th></Th>
                            <Th></Th>
                            <Th></Th>
                            <Th fontSize={15} color='#000'>
                                {dispatchData?.totalQuantity}
                            </Th>
                            <Th></Th>
                            <Th fontSize={15} color='#000'>
                                {dispatchData?.totalPrice}
                            </Th>
                            <Th></Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            <EditModal
                isOpen={modal.isOpen}
                onClose={handleModalClose}
                selectedRow={selectedRow}
                onSuccess={handleSuccess}
            />
            <Dialog
                isOpen={isOpen}
                onClose={onClose}
                header='Удалить'
                body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                actionBtn={() => {
                    handlerDeleteUser()
                }}
                actionText='Удалить'
            />
        </UniversalComponent>
    )
})

export default ListTable
