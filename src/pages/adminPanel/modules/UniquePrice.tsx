import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import dayjs from 'dayjs'
import {
    Box,
    Button,
    Table,
    Tbody,
    Th,
    Thead,
    Tr,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Text,
    Td,
    Tfoot,
    useDisclosure,
    IconButton,
} from '@chakra-ui/react'
import UniquePriceAddModal from '../components/UniquePriceAddModal'
import { useState, useEffect, useMemo } from 'react'
import Dialog from '@/components/Dialog'
import {
    getAllIndividualPrices,
    deleteIndividualPrice,
} from '@/utils/services/individualPrices.service'

import { useApi } from '@/utils/services/axios'
import { TableContainer } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { individualPriceType } from '@/utils/types/individualPrice.types'
import { UniquePriceType } from '@/utils/types/uniquePrice.types'
import { useNotify } from '@/utils/hooks/useNotify'

const AdminPanel = () => {
    const { success, error } = useNotify()
    const { data: individualPrices, mutate } = useApi<individualPriceType[]>('inPrice')
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [selectedData, setSelectedData] = useState<UniquePriceType | undefined>(undefined)
    const [selectedRelease, setSelectedRelease] = useState<string>('')
    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const [inPriceData, setInPriceData] = useState<individualPriceType[]>([])

    const handleClose = () => {
        onClose()
        setSelectedData(undefined)
    }

    const getIndividualPrices = () => {
        getAllIndividualPrices().then((responseData) => {
            setInPriceData(responseData)
        })
    }

    useEffect(() => {
        getIndividualPrices()
    }, [])

    const recentUpdatesDates = useMemo(() => {
        if (!Array.isArray(individualPrices) || individualPrices.length === 0) {
            return []
        }

        return individualPrices.map((client) => {
            const { clientName, detail } = client

            if (!Array.isArray(detail) || !detail.length) {
                return { name: clientName, recentUpdates: null }
            }

            const lastUpdate = detail.reduce((prev, current) => {
                const prevDate = new Date(prev.date)
                const currentDate = new Date(current.date)
                return prevDate > currentDate ? prev : current
            })

            return { name: clientName, recentUpdates: lastUpdate.date }
        })
    }, [individualPrices])

    return (
        <>
            <UniversalComponent>
                <Box display='flex' flexDirection='column' p={5}>
                    <Box>
                        <Box
                            display='flex'
                            width='100%'
                            justifyContent='space-between'
                            paddingLeft={4}
                            paddingRight={10}
                            marginBottom={5}
                        >
                            <Text>Реализатор</Text>
                            <Text>Время изменения</Text>
                        </Box>
                        <Accordion
                            allowMultiple
                            style={{
                                height: '100%',
                                width: '100%',
                                overflowX: 'auto',
                                overflowY: 'auto',
                                maxHeight: '80dvh',
                                minHeight: '80dvh',
                            }}
                        >
                            {inPriceData?.map((item, index) => {
                                return (
                                    <AccordionItem key={index}>
                                        <h2>
                                            <AccordionButton background='#F5F5F5'>
                                                <Box
                                                    as='span'
                                                    flex='1'
                                                    textAlign='left'
                                                    fontWeight={600}
                                                >
                                                    {item.clientName}
                                                </Box>
                                                {recentUpdatesDates?.map((dateData, index) => {
                                                    if (dateData.name == item.clientName) {
                                                        return (
                                                            <Text
                                                                mr='10px'
                                                                fontWeight='600'
                                                                key={index}
                                                            >
                                                                {dateData.recentUpdates
                                                                    ? dayjs(
                                                                          dateData.recentUpdates,
                                                                      ).format('DD.MM.YYYY HH:mm')
                                                                    : ''}
                                                            </Text>
                                                        )
                                                    }
                                                })}

                                                <AccordionIcon />
                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <TableContainer
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    overflowY: 'auto',
                                                }}
                                            >
                                                <Table variant='simple'>
                                                    <Thead>
                                                        <Tr textAlign='center'>
                                                            <Th w='20%'>Продукты</Th>
                                                            <Th w='20%' isNumeric>
                                                                Цена
                                                            </Th>
                                                            <Th></Th>
                                                            <Th w='20%' isNumeric>
                                                                Время изменения
                                                            </Th>
                                                            <Th></Th>

                                                            <Th w='10%' textAlign='center'>
                                                                Действия
                                                            </Th>
                                                        </Tr>
                                                    </Thead>
                                                    <Tbody>
                                                        {item.detail &&
                                                            item.detail.map((value, index) => {
                                                                return (
                                                                    <Tr key={index}>
                                                                        <Td w='20%'>
                                                                            {value.name}
                                                                        </Td>
                                                                        <Td w='20%' isNumeric>
                                                                            {Number(
                                                                                value.price,
                                                                            ).formatted()}
                                                                        </Td>
                                                                        <Td></Td>
                                                                        <Td w='20%' isNumeric>
                                                                            {dayjs(
                                                                                value.date,
                                                                            ).format(
                                                                                'DD.MM.YYYY HH:mm',
                                                                            )}
                                                                        </Td>
                                                                        <Td></Td>

                                                                        <Td
                                                                            display='flex'
                                                                            justifyContent='center'
                                                                        >
                                                                            <IconButton
                                                                                variant='outline'
                                                                                size='sm'
                                                                                colorScheme='teal'
                                                                                aria-label='Send email'
                                                                                marginRight={3}
                                                                                onClick={() => {
                                                                                    setSelectedData(
                                                                                        {
                                                                                            clientId:
                                                                                                item.clientId,
                                                                                            clientName:
                                                                                                item.clientName,
                                                                                            detail: [
                                                                                                {
                                                                                                    individualPriceId:
                                                                                                        value.individualPriceId,
                                                                                                    id: value.id,
                                                                                                    name: value.name,
                                                                                                    price: value.price,
                                                                                                    date: value.date,
                                                                                                },
                                                                                            ],
                                                                                        },
                                                                                    )
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
                                                                                    setSelectedData(
                                                                                        {
                                                                                            clientId:
                                                                                                item.clientId,
                                                                                            clientName:
                                                                                                item.clientName,
                                                                                            detail: [
                                                                                                {
                                                                                                    individualPriceId:
                                                                                                        value.individualPriceId,
                                                                                                    id: value.id,
                                                                                                    name: value.name,
                                                                                                    price: value.price,
                                                                                                    date: value.date,
                                                                                                },
                                                                                            ],
                                                                                        },
                                                                                    )
                                                                                    setDialog({
                                                                                        ...dialog,
                                                                                        isOpen: true,
                                                                                    })
                                                                                }}
                                                                                icon={
                                                                                    <DeleteIcon />
                                                                                }
                                                                            />
                                                                        </Td>
                                                                    </Tr>
                                                                )
                                                            })}
                                                    </Tbody>
                                                    <Tfoot>
                                                        <Tr>
                                                            <Th></Th>
                                                            <Th></Th>
                                                            <Th></Th>
                                                            <Th></Th>
                                                            <Th></Th>
                                                            <Th
                                                                display='flex'
                                                                justifyContent='center'
                                                            >
                                                                <Button
                                                                    colorScheme='purple'
                                                                    onClick={() => {
                                                                        setSelectedRelease(
                                                                            item.clientName,
                                                                        )
                                                                        onOpen()
                                                                    }}
                                                                >
                                                                    Добавить
                                                                </Button>
                                                            </Th>
                                                        </Tr>
                                                    </Tfoot>
                                                </Table>
                                            </TableContainer>
                                        </AccordionPanel>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </Box>
                </Box>

                <UniquePriceAddModal
                    data={selectedData}
                    selectedRelease={selectedRelease}
                    isOpen={isOpen}
                    onClose={handleClose}
                    onSuccess={getIndividualPrices}
                />
                <Dialog
                    isOpen={dialog.isOpen}
                    onClose={() => {
                        dialog.onClose()
                        setSelectedData(undefined)
                    }}
                    header='Удалить'
                    body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                    actionBtn={() => {
                        deleteIndividualPrice(selectedData?.detail[0].individualPriceId ?? '')
                            .then((res) => {
                                getIndividualPrices()
                                setSelectedData(undefined)
                                success(res.data.message)
                                mutate()
                            })
                            .catch((err) => {
                                error(err.response.data.error)
                            })
                        dialog.onClose()
                    }}
                    actionText='Удалить'
                />
            </UniversalComponent>
        </>
    )
}

export default AdminPanel
