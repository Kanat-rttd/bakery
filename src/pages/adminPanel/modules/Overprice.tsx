import {
    Table,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    useDisclosure,
    Button,
    Select,
    IconButton,
} from '@chakra-ui/react'
import OverPriceAddModal from '../components/OverPriceAddModal'
import { useEffect, useState } from 'react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import Dialog from '@/components/Dialog'
import { useApi } from '@/utils/services/axios'
import { deleteOverprice } from '@/utils/services/overprice.service'
import { TableContainer, Thead } from '@/components/ui'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { OverPriceType } from '@/utils/types/overPrice.types'
import { ClientsFilter } from '@/utils/types/client.type'
import dayjs from 'dayjs'
import { monthData } from '@/utils/constants/month.consts'

const AdminPanel = () => {
    const { getURLs, setParam, getParam, setParamObject } = useURLParameters()

    const {
        data: overPriceData,
        isLoading,
        mutate: mutateOverPriceData,
    } = useApi<OverPriceType[]>(`overPrice?${getURLs().toString()}`)

    const { data: clientData } = useApi<ClientsFilter[]>('overPrice/clientFilter')

    const [years, setYears] = useState<number[]>([])
    const startYear = 2022

    useEffect(() => {
        setParamObject({
            month: getParam('month') ? getParam('month') : dayjs().format('M'),
            year: getParam('year') ? getParam('year') : dayjs().format('YYYY'),
        })
        getYearsArray(startYear)
    }, [])

    const getYearsArray = (startYear: number) => {
        const currentYear = new Date().getFullYear() + 1
        const years = []

        for (let year = startYear; year <= currentYear; year++) {
            years.push(year)
        }

        setYears(years)
    }

    const { onOpen, isOpen, onClose } = useDisclosure()
    const [selectedData, setSelectedData] = useState<OverPriceType>()
    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const handleSuccess = () => {
        mutateOverPriceData()
    }

    const delOverprice = (selectedData: OverPriceType | undefined) => {
        if (selectedData) {
            deleteOverprice(selectedData.id).then(() => {
                handleSuccess()
            })
        } else {
            console.error('No product data available to delete.')
        }
        setSelectedData({
            id: 0,
            price: '',
            contragentId: 0,
            month: '',
            year: '',
            isDeleted: 0,
            contragent: {
                id: 0,
                contragentName: '',
            },
        })
    }

    const handleClose = () => {
        setSelectedData(undefined)
        onClose()
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        setParam('name', value)
    }

    return (
        <>
            <UniversalComponent>
                <Box display='flex' flexDirection='column' p={5}>
                    <Box marginBottom={6} display='flex' justifyContent='space-between'>
                        <Box width='100%' display='flex' gap='15px' mt={2}>
                            <Select
                                size='sm'
                                borderRadius={5}
                                placeholder='Имя'
                                width='20%'
                                name='name'
                                onChange={handleSelectChange}
                            >
                                {clientData?.map((client, index) => (
                                    <option key={index} value={client.contragent.contragentName}>
                                        {client.contragent.contragentName}
                                    </option>
                                ))}
                            </Select>

                            <Select
                                size='sm'
                                w='20%'
                                borderRadius={5}
                                value={getParam('month')}
                                onChange={(e) => setParam('month', e.target.value)}
                            >
                                {monthData.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                size='sm'
                                w='20%'
                                borderRadius={5}
                                value={getParam('year')}
                                onChange={(e) => setParam('year', e.target.value)}
                            >
                                {years.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </Select>
                        </Box>

                        <Button colorScheme='purple' onClick={onOpen}>
                            Добавить
                        </Button>
                    </Box>
                    <TableContainer
                        isLoading={isLoading}
                        style={{ width: '100%', height: '100%', overflowY: 'auto' }}
                    >
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>№</Th>
                                    <Th>Реализатор</Th>
                                    <Th>Сверху</Th>
                                    <Th>Месяц</Th>
                                    <Th>Год</Th>
                                    <Th>Действия</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {overPriceData?.length ? (
                                    overPriceData.map((overData, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{index + 1}</Td>
                                                <Td>{overData.contragent?.contragentName}</Td>
                                                <Td>{Number(overData.price).formatted()}</Td>
                                                <Td>{overData.month}</Td>
                                                <Td>{overData.year}</Td>
                                                <Td>
                                                    <IconButton
                                                        variant='outline'
                                                        size='sm'
                                                        colorScheme='teal'
                                                        aria-label='Send email'
                                                        marginRight={3}
                                                        onClick={() => {
                                                            setSelectedData(overData)
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
                                                            setSelectedData(overData)
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
                    <OverPriceAddModal
                        data={selectedData}
                        isOpen={isOpen}
                        onClose={handleClose}
                        onSuccess={handleSuccess}
                    />
                    <Dialog
                        isOpen={dialog.isOpen}
                        onClose={() => {
                            dialog.onClose()
                            setSelectedData({
                                id: 0,
                                price: '',
                                contragentId: 0,
                                month: '',
                                year: '',
                                isDeleted: 0,
                                contragent: {
                                    id: 0,
                                    contragentName: '',
                                },
                            })
                        }}
                        header='Удалить'
                        body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                        actionBtn={() => {
                            dialog.onClose()
                            delOverprice(selectedData)
                        }}
                        actionText='Удалить'
                    />
                </Box>
            </UniversalComponent>
        </>
    )
}

export default AdminPanel
