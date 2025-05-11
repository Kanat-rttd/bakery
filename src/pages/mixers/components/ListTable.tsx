import Dialog from '@/components/Dialog'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, IconButton, Select, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import dayjs from 'dayjs'
import { useApi } from '@/utils/services/axios'
import { TableContainer, Thead } from '@/components/ui'
import DateRange from '@/components/DateRange'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { FacilityUnit } from '@/utils/types/product.types'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { ShiftAccountingType } from '@/utils/types/shiftAccounting.types'
import EditModal from './EditModal'
import { deleteShiftAccounting } from '@/utils/services/shiftAccounting.service'
import { useNotify } from '@/utils/hooks/useNotify'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'

interface ListTableProps {
    shiftAccounting: ShiftAccountingType[] | undefined
    mutate: () => void
}

const ListTable = forwardRef(({ shiftAccounting, mutate }: ListTableProps, ref) => {
    const { loading, error } = useNotify()
    const { getParam, setParam } = useURLParameters()

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const { data: facilityUnits } = useApi<FacilityUnit[] | undefined>(`mixers`)

    const [selectedData, setSelectedData] = useState<ShiftAccountingType | undefined>(undefined)

    const handleClose = () => {
        setSelectedData(undefined)
        modal.onClose()
    }

    const handleSuccess = () => {
        mutate()
    }

    const [modal, setModal] = useState({
        isOpen: false,
        onClose: () => setModal({ ...modal, isOpen: false }),
    })

    const handlerDeleteShiftAccounting = (selectedData: ShiftAccountingType | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteShiftAccounting(selectedData.id)
            loading(responsePromise)
            responsePromise.then(() => {
                mutate()
            })
        } else {
            console.error('No user data available to delete.')
        }
    }

    useImperativeHandle(ref, () => ({
        async export() {
            if (!shiftAccounting || shiftAccounting.length === 0) {
                return error('Нет данных для экспорта')
            }

            const headers = ['№', 'Дата', 'Цех', 'Сотрудник', 'Количество часов']
            const data: Array<Array<unknown>> = []

            let idx = 1

            shiftAccounting.forEach((item) => {
                item.shiftAccountingDetails.forEach((detail) => {
                    data.push([
                        idx.toString(),
                        new Date(item.date).toLocaleDateString(),
                        item.bakingFacilityUnit.facilityUnit,
                        detail.departPersonal.name,
                        detail.shiftTime.toString(),
                    ])
                    idx++
                })
            })

            const startDate = new Date(getParam('startDate')).toLocaleDateString()
            const endDate = new Date(getParam('endDate')).toLocaleDateString()

            await generateExcel(`Учет смен c ${startDate} по ${endDate}`, [headers, ...data])
        },
    }))

    return (
        <>
            <UniversalComponent>
                <Box display='flex' justifyContent='space-between'>
                    <Box display='flex' gap='15px' width='fit-content' mt={-3} mb={2}>
                        <DateRange />
                        <Select
                            className='print-hidden'
                            size='sm'
                            borderRadius={5}
                            placeholder='Цех'
                            width='fit-content'
                            defaultValue={getParam('facilityUnit')}
                            onChange={(e) => setParam('facilityUnit', e.target.value)}
                        >
                            {facilityUnits?.map((item, index) => (
                                <option key={index} value={item.id}>
                                    {item.facilityUnit}
                                </option>
                            ))}
                        </Select>
                    </Box>
                </Box>

                <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>№</Th>
                                <Th>Дата</Th>
                                <Th>Цех</Th>
                                <Th>Сотрудник </Th>
                                <Th>Кол-во часов</Th>
                                <Th className='print-hidden'>Действия</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {shiftAccounting?.length ? (
                                shiftAccounting?.map((row, index) => {
                                    return (
                                        <Tr key={row.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{dayjs(row.date).format('DD.MM.YYYY')}</Td>
                                            <Td>{row.bakingFacilityUnit.facilityUnit}</Td>
                                            <Td>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                    }}
                                                >
                                                    {row.shiftAccountingDetails.map((details) => (
                                                        <span key={details.id}>
                                                            {details.departPersonal.name}
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
                                                    {row.shiftAccountingDetails.map((details) => (
                                                        <span key={details.id}>
                                                            {details.shiftTime}
                                                        </span>
                                                    ))}
                                                </div>
                                            </Td>
                                            <Td className='print-hidden'>
                                                <IconButton
                                                    variant='outline'
                                                    size='sm'
                                                    colorScheme='teal'
                                                    aria-label='Send email'
                                                    marginRight={2}
                                                    onClick={() => {
                                                        setSelectedData(row)
                                                        setModal({ ...modal, isOpen: true })
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
                                </Tr>
                            )}
                        </Tbody>
                    </Table>
                </TableContainer>
            </UniversalComponent>
            <EditModal
                isOpen={modal.isOpen}
                onClose={handleClose}
                onSuccess={handleSuccess}
                data={selectedData}
            />
            <Dialog
                isOpen={dialog.isOpen}
                onClose={dialog.onClose}
                header='Удалить'
                body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                actionBtn={() => {
                    dialog.onClose()
                    handlerDeleteShiftAccounting(selectedData)
                }}
                actionText='Удалить'
            />
        </>
    )
})

export default ListTable
