import RequestAddModal from '@/pages/requests/components/RequestAddModal'
import { OrderArrayType } from '@/utils/types/order.types'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    Box,
    Heading,
    AccordionIcon,
    AccordionPanel,
    Table,
    Tbody,
    Tr,
    Td,
    Tfoot,
    Button,
    useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import Dialog from './Dialog'
import { deleteSale } from '@/utils/services/sales.service'
import { useApi } from '@/utils/services/axios'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import dayjs from 'dayjs'
import { useNotify } from '@/utils/hooks/useNotify'

type accorfionClientType = {
    data: OrderArrayType[]
    handleChangeStatus: (clientName: OrderArrayType) => void
}

const AccordionClients = ({ data, handleChangeStatus }: accorfionClientType) => {
    const { getURLs } = useURLParameters()
    const { loading } = useNotify()
    const { mutate: mutateSalesData } = useApi<OrderArrayType[]>(`sales?${getURLs().toString()}`)
    const defaultIndex = Array.from({ length: data.length }, (_, index) => index)
    const [selectedData, setSelectedData] = useState<OrderArrayType | undefined>(undefined)

    const { onOpen, isOpen, onClose } = useDisclosure()

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const handleConfirmClick = (clientName: OrderArrayType) => {
        handleChangeStatus(clientName)
    }

    if (!data || data.length === 0) {
        return <div>Данных находящихся в обработке пока нет</div>
    }

    const handleDeleteOrder = (selectedData: OrderArrayType | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<unknown> = deleteSale(selectedData.id)
            loading(responsePromise as Promise<{ message: string }>)
            responsePromise.then(() => {
                mutateSalesData()
            })
        } else {
            console.error('No user data available to delete.')
        }
    }

    const handleClose = () => {
        setSelectedData(undefined)
        onClose()
    }

    return (
        <>
            <Accordion
                defaultIndex={defaultIndex}
                allowMultiple
                style={{
                    height: '100%',
                    width: '100%',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    maxHeight: '79dvh',
                    minHeight: '79dvh',
                }}
            >
                {data?.map((order) => (
                    <AccordionItem key={order.id}>
                        <h2>
                            <AccordionButton backgroundColor='#e6e6e6' display='flex' gap='10px'>
                                <Box
                                    display='flex'
                                    justifyContent='space-between'
                                    as='span'
                                    flex='1'
                                    textAlign='left'
                                    mr='60px'
                                >
                                    <Box display='flex' gap={10} width='60%'>
                                        <Heading size='sm' minWidth='20%'>
                                            {order.client.name}
                                        </Heading>
                                        <Heading size='sm'>
                                            Смена: {dayjs(order.date).format('DD.MM.YYYY')}
                                        </Heading>
                                    </Box>

                                    <Heading size='sm'>Итого: {order.totalQuantity}</Heading>
                                </Box>
                                <Box display='flex'>
                                    <Box
                                        p={1.5}
                                        backgroundColor='#fff'
                                        border='1px solid teal'
                                        borderRadius={4}
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                        marginRight={2}
                                    >
                                        <EditIcon
                                            color='teal'
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setSelectedData(order)
                                                onOpen()
                                            }}
                                        />
                                    </Box>

                                    <Box
                                        p={1.5}
                                        backgroundColor='#fff'
                                        border='1px solid teal'
                                        borderRadius={4}
                                        display='flex'
                                        alignItems='center'
                                        justifyContent='center'
                                    >
                                        <DeleteIcon
                                            color='teal'
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                setSelectedData(order)
                                                setDialog({
                                                    ...dialog,
                                                    isOpen: true,
                                                })
                                            }}
                                        />
                                    </Box>
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={0}>
                            <Table variant='unstyled'>
                                <Tbody>
                                    {order.orderDetails.map((item, index) => (
                                        <Tr key={index}>
                                            <Td width='80%'>{item.product.name}</Td>
                                            <Td>{item.orderedQuantity}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                                <Tfoot>
                                    <Tr>
                                        <Td></Td>
                                        <Td>
                                            <Button
                                                width='100%'
                                                onClick={() => handleConfirmClick(order)}
                                            >
                                                Подтвердить
                                            </Button>
                                        </Td>
                                    </Tr>
                                </Tfoot>
                            </Table>
                        </AccordionPanel>
                    </AccordionItem>
                ))}
            </Accordion>
            {selectedData && (
                <RequestAddModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    selectedData={selectedData}
                    mutate={mutateSalesData}
                />
            )}
            <Dialog
                isOpen={dialog.isOpen}
                onClose={dialog.onClose}
                header='Удалить'
                body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                actionBtn={() => {
                    dialog.onClose()
                    handleDeleteOrder(selectedData)
                }}
                actionText='Удалить'
            />
        </>
    )
}

export default AccordionClients
