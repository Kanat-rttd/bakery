import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Table, Tbody, Tr, Th, Td, useDisclosure, IconButton } from '@chakra-ui/react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import EditModal from './EditModal'
import dayjs from 'dayjs'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import Dialog from '@/components/Dialog'
import { useNotify } from '@/utils/hooks/useNotify'
import { deletePurchase } from '@/utils/services/productPurchase.service'
import { PurchaseType } from '@/utils/types/purchase.types'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'

interface AllPurchases {
    purchases: PurchaseType[]
    totalQuantity: number
    totalSum: number
    totalDeliverySum: number
}

interface ListTableProps {
    purchasesData: AllPurchases | undefined
    mutate: () => void
}

const ListTable = forwardRef(({ purchasesData, mutate }: ListTableProps, ref) => {
    const { loading, error } = useNotify()
    const { getParam } = useURLParameters()
    const [selectedData, setSelectedData] = useState<PurchaseType>()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const filteredPurchases = purchasesData?.purchases.filter((purchase) => {
        return !getParam('providerId') || Number(getParam('providerId')) === purchase.provider.id
    })

    const handleSelected = (data: PurchaseType) => {
        setSelectedData(data)
        onOpen()
    }

    const handlerDelete = async (selectedData: PurchaseType | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deletePurchase(selectedData.id)
            loading(responsePromise)
            await responsePromise
            mutate()
        } else {
            console.error('No Purchase data available to delete.')
        }
    }

    useImperativeHandle(ref, () => ({
        async export() {
            if (!filteredPurchases || filteredPurchases.length === 0) {
                return error('Нет данных для экспорта')
            }

            const startDate = new Date(getParam('startDate')).toLocaleDateString()
            const endDate = new Date(getParam('endDate')).toLocaleDateString()

            const headers = [
                '№',
                'Дата',
                'Поставщик',
                'Товар',
                'Количество',
                'Цена',
                'Сумма',
                'Сумма доставки',
                'Статус',
            ]
            const data = [
                headers,
                ...filteredPurchases.map((item, idx) => [
                    idx + 1,
                    new Date(item.date).toLocaleDateString(),
                    item.provider.providerName,
                    item.providerGood.goods,
                    item.quantity,
                    item.price,
                    item.totalSum,
                    item.deliverySum,
                    item.status,
                ]),
                [
                    '',
                    'ИТОГО',
                    '',
                    '',
                    '',
                    purchasesData?.totalQuantity,
                    purchasesData?.totalSum,
                    purchasesData?.totalDeliverySum,
                    '',
                ],
            ]

            await generateExcel(`Закуп с ${startDate} по ${endDate}`, data)
        },
    }))

    return (
        <>
            <TableContainer style={{ width: '100%', overflowY: 'auto' }}>
                <Table variant='simple' size='sm'>
                    <Thead>
                        <Tr>
                            <Th>№</Th>
                            <Th>Дата</Th>
                            <Th>Поставщик</Th>
                            <Th>Товар</Th>
                            <Th>Количество</Th>
                            <Th>Цена</Th>
                            <Th>Сумма</Th>
                            <Th>Сумма доставки</Th>
                            <Th>Статус</Th>
                            <Th className='print-hidden'>Действия</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredPurchases?.length ? (
                            filteredPurchases.map((purchase, index) => {
                                return (
                                    <Tr key={purchase.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{dayjs(purchase.date).format('DD.MM.YYYY')}</Td>
                                        <Td>{purchase.provider.providerName}</Td>
                                        <Td>{purchase.providerGood.goods}</Td>
                                        <Td>{purchase.quantity.formatted()}</Td>
                                        <Td>{purchase.price.formatted()}</Td>
                                        <Td>{purchase.totalSum.formatted()}</Td>
                                        <Td>{purchase.deliverySum.formatted()}</Td>
                                        <Td>{purchase.status}</Td>
                                        <Td className='print-hidden'>
                                            <IconButton
                                                variant='outline'
                                                size='sm'
                                                colorScheme='teal'
                                                aria-label='Send email'
                                                marginRight={3}
                                                onClick={() => {
                                                    handleSelected(purchase)
                                                }}
                                                icon={<EditIcon />}
                                            />
                                            <IconButton
                                                variant='outline'
                                                size='sm'
                                                colorScheme='teal'
                                                aria-label='Send email'
                                                onClick={() => {
                                                    setSelectedData(purchase)
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
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th color='#000' fontSize={15} fontWeight='bold'>
                                ИТОГО
                            </Th>
                            <Th> </Th>
                            <Th> </Th>
                            <Th> </Th>
                            <Th> </Th>
                            <Th color='#000' fontSize={15} fontWeight='bold'>
                                {purchasesData?.totalQuantity.formatted()}
                            </Th>
                            <Th color='#000' fontSize={15} fontWeight='bold'>
                                {purchasesData?.totalSum.formatted()}
                            </Th>
                            <Th color='#000' fontSize={15} fontWeight='bold'>
                                {purchasesData?.totalDeliverySum.formatted()}
                            </Th>
                            <Th> </Th>
                            <Th> </Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            <EditModal
                selectedData={selectedData}
                isOpen={isOpen}
                onClose={onClose}
                onSuccess={mutate}
            />
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
