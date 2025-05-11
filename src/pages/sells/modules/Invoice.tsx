import { Box, Button, Select, Text, useDisclosure } from '@chakra-ui/react'
import { useState } from 'react'
import { useApi } from '@/utils/services/axios'
import InvoiceModal from '../components/InvoiceModal'
import dayjs from 'dayjs'
import DateRange from '@/components/DateRange'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { OverPriceType } from '@/utils/types/overPrice.types'
import { ContragentCategoryType, ContragentType } from '@/utils/types/contragent.types'
import { DownloadAll } from '../components/DownloadAll'

interface InvoiceData {
    createdAt: Date
    contragentId: number
    contragentName: string
    invoiceNumber: number
    totalProducts: {
        id: number
        name: string
        price: number
        quantity: number
        totalPrice: number
    }[]
    totalSum: number
    dispatches: {
        id: number
        contragentId: number
        createdAt: Date
        dispatch: number
        goodsDispatchDetails: {
            id: number
            productId: number
            quantity: number
            price: number | null
            product: {
                id: number
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
    }[]
}

// interface Client {
//     id: number
//     name: string
//     surname: string
//     contact: string
//     telegrammId: string
//     status: string
// }

const InvoicePage = () => {
    const { setParam, getURLs } = useURLParameters()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { data: contragentsTypesData } = useApi<ContragentCategoryType[]>('contragentType')
    const { data: clientsData } = useApi<ContragentType[]>(
        `contragent?status=1&type=${
            contragentsTypesData?.find((item) => item.type === 'реализатор')?.id
        }`,
    )
    const { data: dispatchesData } = useApi<InvoiceData[]>(
        `release/invoice?${getURLs().toString()}`,
    )

    const currentMonth = dayjs().month() + 1
    const currentYear = dayjs().year()

    const { data: overPriceData } = useApi<OverPriceType[]>(
        `overPrice?month=${currentMonth}&year=${currentYear}`,
    )

    const [selectedRow, setSelectedRow] = useState<InvoiceData | null>(null)

    return (
        <>
            <Box>
                <Box width='100%' height='100%' p={5} mt={2}>
                    <Box marginBottom={5} display='flex' justifyContent='space-between'>
                        <Box className='print-hidden' display='flex' gap='15px' width='fit-content'>
                            <DateRange />
                            <Select
                                placeholder='Реализатор'
                                width='fit-content'
                                size='sm'
                                borderRadius={5}
                                name='clientId'
                                onChange={(event) => setParam('contragentId', event.target.value)}
                            >
                                {clientsData?.map((client, index) => (
                                    <option key={index} value={client.id}>
                                        {client.contragentName}
                                    </option>
                                ))}
                            </Select>
                        </Box>
                        <DownloadAll invoices={dispatchesData} overPrices={overPriceData} />
                    </Box>
                    <Box
                        className='print-hidden'
                        style={{
                            height: '100%',
                            width: '100%',
                            overflowX: 'auto',
                            overflowY: 'auto',
                            maxHeight: '78dvh',
                            minHeight: '78dvh',
                        }}
                    >
                        {dispatchesData?.length ? (
                            dispatchesData?.map((row, index) => {
                                const overPrice =
                                    overPriceData?.find(
                                        (price) => price.contragentId == row.contragentId,
                                    )?.price || 0
                                return (
                                    <Button
                                        key={index}
                                        w='100%'
                                        p={8}
                                        display='flex'
                                        justifyContent='space-between'
                                        border='1px solid black'
                                        borderRadius={0}
                                        onClick={() => {
                                            onOpen()
                                            setSelectedRow(row)
                                        }}
                                        marginBottom={1}
                                    >
                                        <Box display='flex' gap={10} textAlign='start' w='35%'>
                                            <Text w='30%' color='gray' fontWeight=''>
                                                № {row.invoiceNumber}
                                            </Text>
                                            <Text w='44%'>{row.contragentName}</Text>
                                            <Text w='25%'>
                                                {dayjs(row.createdAt).format('DD.MM.YYYY')}
                                            </Text>
                                        </Box>
                                        <Box
                                            display='flex'
                                            gap={20}
                                            w='25%'
                                            justifyContent='space-between'
                                        >
                                            <Text minWidth='40%' textAlign='start'>
                                                Сверху: {Number(overPrice).formatted()} ₸
                                            </Text>
                                            <Text minW='60%' textAlign='start'>
                                                Сумма: {row.totalSum.formatted()} ₸
                                            </Text>
                                        </Box>
                                        <Text w='12%' textAlign='start'>
                                            Итого: {(Number(overPrice) + row.totalSum).formatted()}{' '}
                                            ₸
                                        </Text>
                                    </Button>
                                )
                            })
                        ) : (
                            <p>Данных о накладных пока нет</p>
                        )}
                    </Box>
                </Box>
            </Box>
            <InvoiceModal isOpen={isOpen} onClose={onClose} selectedRow={selectedRow} />
        </>
    )
}

export default InvoicePage
