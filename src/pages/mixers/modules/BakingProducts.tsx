import { useEffect, useState } from 'react'
import {
    Box,
    Table,
    Tr,
    Th,
    Tbody,
    Td,
    Button,
    Select,
    useDisclosure,
    IconButton,
} from '@chakra-ui/react'
import BakingAddModal from '../components/BakingAddModal'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import DateRange from '@/components/DateRange'
import { useApi } from '@/utils/services/axios'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import Dialog from '@/components/Dialog'
import { useNotify } from '@/utils/hooks/useNotify'
import { deleteBaking } from '@/utils/services/baking.service'
import { FacilityUnit } from '@/utils/types/product.types'
import { BakingDataType, BakingType } from '@/utils/types/baking.types'
import dayjs from 'dayjs'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'

const styles = {
    textAlign: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#000',
}

const BakingPage = () => {
    const { error } = useNotify()
    const { getURLs, getParam, setParam } = useURLParameters()
    const { loading } = useNotify()
    const { onOpen, onClose, isOpen } = useDisclosure()

    const { data: facilityUnits } = useApi<FacilityUnit[] | undefined>(`mixers`)
    const { data: bakingsData, mutate: mutateBakingData } = useApi<BakingType>(
        `baking?${getURLs().toString()}`,
    )

    const [selectedBaking, setSelectedBaking] = useState<BakingDataType | undefined>(undefined)
    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const handledSuccess = () => {
        mutateBakingData()
    }

    const handlerDelete = (selectedBaking: BakingDataType | undefined) => {
        if (selectedBaking) {
            const responsePromise: Promise<any> = deleteBaking(selectedBaking.id)
            loading(responsePromise)
            responsePromise.then(() => {
                mutateBakingData()
            })
        } else {
            console.error('No user data available to delete.')
        }
    }

    useEffect(() => {
        if (!bakingsData) return
        // setBakingsDetails()
    }, [bakingsData])

    const exportExcel = async () => {
        if (bakingsData?.bakingData.length === 0 || !bakingsData) {
            return error('Нет данных для экспорта')
        }

        const headers = [
            '№',
            'Вид хлеба',
            'Время и дата',
            'Мука',
            'Соль',
            'Дрожжи',
            'Солод',
            'Масло',
            'Выход',
            'Брак',
        ]

        const formattedData = bakingsData.bakingData.map((entry, idx) => [
            idx + 1,
            entry.product?.name,
            new Date(entry.dateTime).toLocaleString(),
            entry.flour.quantity || 0,
            entry.salt.quantity || 0,
            entry.yeast.quantity || 0,
            entry.malt.quantity || 0,
            entry.butter.quantity || 0,
            entry.output || 0,
            entry.defective || 0,
        ])

        const startDate = new Date(getParam('startDate')).toLocaleDateString()
        const endDate = new Date(getParam('endDate')).toLocaleDateString()

        await generateExcel(`Выпечка с ${startDate} по ${endDate}`, [
            headers,
            ...formattedData,
            [
                '',
                'ИТОГО',
                '',
                bakingsData.totals.totalFlour,
                bakingsData.totals.totalSalt,
                bakingsData.totals.totalYeast,
                bakingsData.totals.totalMalt,
                bakingsData.totals.totalButter,
                bakingsData.totals.totalOutput,
                bakingsData.totals.totalDefective,
            ],
        ])
    }

    return (
        <>
            <Box p={5} mt={1}>
                <Box display='flex' justifyContent='space-between' width='100%'>
                    <Box marginBottom={7} display='flex' gap={15} width='100%'>
                        <DateRange />
                        <Select
                            className='print-hidden'
                            placeholder='Цех'
                            width='17%'
                            size='sm'
                            borderRadius={5}
                            justifyContent='space-between'
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
                    <Box className='print-hidden' display='flex' gap='15px'>
                        <Button
                            size='md'
                            backgroundColor='#6B6FDB'
                            color='white'
                            fontSize='px'
                            borderRadius='10px'
                            // width='15%'
                            onClick={() => {
                                setSelectedBaking(undefined)
                                onOpen()
                            }}
                        >
                            Добавить
                        </Button>
                        <Button type='button' onClick={exportExcel}>
                            Экспорт в Excel
                        </Button>
                        <Button type='button' onClick={() => window.print()}>
                            Экспорт в PDF
                        </Button>
                    </Box>

                    <BakingAddModal
                        data={selectedBaking}
                        isOpen={isOpen}
                        onClose={onClose}
                        onSuccess={handledSuccess}
                    />
                </Box>
                <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                    <Table variant='simple'>
                        <Thead>
                            <Tr>
                                <Th>#</Th>
                                <Th>Вид хлеба</Th>
                                <Th sx={styles}>Время и дата</Th>
                                <Td sx={styles} textAlign='center'>
                                    Мука
                                </Td>
                                <Td sx={styles} textAlign='center'>
                                    Соль
                                </Td>
                                <Td sx={styles} textAlign='center'>
                                    Дрожжи
                                </Td>
                                <Td sx={styles} textAlign='center'>
                                    Солод
                                </Td>
                                <Td sx={styles} textAlign='center'>
                                    Масло
                                </Td>
                                <Th sx={styles}>Выход</Th>
                                <Th sx={styles}>Брак</Th>
                                <Th className='print-hidden'>Действия</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {bakingsData?.bakingData.length ? (
                                bakingsData?.bakingData.map((bakingRow, index) => {
                                    return (
                                        <Tr key={bakingRow.id} textAlign='center'>
                                            <Td>{index + 1}</Td>
                                            <Td>{bakingRow.product?.name}</Td>
                                            <Td textAlign='center'>
                                                {dayjs(bakingRow.dateTime).format(
                                                    'HH:mm DD.MM.YYYY',
                                                )}
                                            </Td>
                                            <Td textAlign='center'>
                                                {bakingRow.flour.quantity || 0}
                                            </Td>
                                            <Td textAlign='center'>
                                                {bakingRow.salt.quantity || 0}
                                            </Td>
                                            <Td textAlign='center'>
                                                {bakingRow.yeast.quantity || 0}
                                            </Td>
                                            <Td textAlign='center'>
                                                {bakingRow.malt.quantity || 0}
                                            </Td>
                                            <Td textAlign='center'>
                                                {bakingRow.butter.quantity || 0}
                                            </Td>

                                            <Td textAlign='center'>{bakingRow.output || 0}</Td>
                                            <Td textAlign='center'>{bakingRow.defective || 0}</Td>
                                            <Td className='print-hidden'>
                                                <IconButton
                                                    variant='outline'
                                                    size='sm'
                                                    colorScheme='teal'
                                                    aria-label='Send email'
                                                    marginRight={3}
                                                    onClick={() => {
                                                        setSelectedBaking(bakingRow)
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
                                                        setSelectedBaking(bakingRow)
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
                                <Th fontSize={16} fontWeight='bold' color='#000'>
                                    Итого
                                </Th>
                                <Th sx={styles}></Th>
                                <Th sx={styles}></Th>
                                <Th sx={styles}>{bakingsData?.totals?.totalFlour || 0}</Th>
                                <Th sx={styles}>{bakingsData?.totals?.totalSalt || 0}</Th>
                                <Th sx={styles}>{bakingsData?.totals?.totalYeast || 0}</Th>
                                <Th sx={styles}>{bakingsData?.totals?.totalMalt || 0}</Th>
                                <Th sx={styles}>{bakingsData?.totals?.totalButter || 0}</Th>
                                <Th sx={styles}>{bakingsData?.totals?.totalOutput || 0}</Th>
                                <Th sx={styles}>{bakingsData?.totals?.totalDefective || 0}</Th>
                                <Th sx={styles}></Th>
                            </Tr>
                        </Tfoot>
                    </Table>
                </TableContainer>
            </Box>
            <Dialog
                isOpen={dialog.isOpen}
                onClose={dialog.onClose}
                header='Удалить'
                body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                actionBtn={() => {
                    dialog.onClose()
                    handlerDelete(selectedBaking)
                }}
                actionText='Удалить'
            />
        </>
    )
}

export default BakingPage
