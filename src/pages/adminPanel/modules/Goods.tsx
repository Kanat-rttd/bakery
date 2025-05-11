import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    IconButton,
    Select,
    Table,
    Tbody,
    Td,
    Th,
    Tr,
    useDisclosure,
} from '@chakra-ui/react'
import { useState } from 'react'
import Dialog from '@/components/Dialog'
import { useApi } from '@/utils/services/axios'
import { deleteProviderGoods } from '@/utils/services/providerGoods.service'
import { mutate } from 'swr'
import { TableContainer, Thead } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import GoodsAddModal from '../components/GoodsAddModal'
import { ProviderType } from '@/utils/types/provider.types'
import { useNotify } from '@/utils/hooks/useNotify'
import { useURLParameters } from '@/utils/hooks/useURLParameters.tsx'

type GoodsCategory = {
    id: number
    category: string
}

interface ProviderGoods {
    id: number
    providerId: number
    goodsCategoryId: number
    unitOfMeasure: string
    goods: string
    place: { label: string }[]
    status: string
    provider: {
        id: number
        name: string
    }
}

const AdminGoods = () => {
    const { error, success } = useNotify()
    const { data: goodsCategories } = useApi<GoodsCategory[]>('goodsCategories')
    const { getURLs, getParam, setParam } = useURLParameters()
    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const { data: providerGoodsData, isLoading } = useApi<ProviderGoods[]>(
        `providerGoods?${getURLs().toString()}`,
    )
    const { data: providerData } = useApi<ProviderType[]>('providers')

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedData, setSelectedData] = useState<ProviderGoods>()

    const handlerDeleteProvider = (selectedData: ProviderGoods | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteProviderGoods(selectedData.id)
            responsePromise
                .then((res) => {
                    mutate(`providerGoods?${getURLs().toString()}`)
                    success(res.data.message)
                })
                .catch((err) => {
                    error(err.response.data.error)
                })
        } else {
            console.error('No user data available to delete.')
        }
        setSelectedData(undefined)
    }

    const handledSuccess = () => {
        mutate(`providerGoods?${getURLs().toString()}`)
        setSelectedData(undefined)
    }

    const handleClose = () => {
        setSelectedData(undefined)
        onClose()
    }

    return (
        <>
            <UniversalComponent>
                <Box width='100%' height='100%' p={5}>
                    <Box marginBottom={5} display='flex' justifyContent='space-between'>
                        <Box display='flex' gap='15px' width='fit-content'>
                            <Select
                                name='status'
                                placeholder='Статус'
                                value={getParam('status')}
                                onChange={(e) => setParam('status', e.target.value)}
                            >
                                <option value={1}>Активный</option>
                                <option value={0}>Неактивный</option>
                            </Select>
                            <Select
                                name='provider'
                                placeholder='Поставщик'
                                value={getParam('providerId')}
                                onChange={(e) => setParam('providerId', e.target.value)}
                            >
                                {providerData?.map(({ providerName, id }) => (
                                    <option key={id} value={id}>
                                        {providerName}
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
                                    <Th>Товар</Th>
                                    <Th>Категория товара</Th>
                                    <Th>Поставщик</Th>
                                    <Th>Единица измерения</Th>
                                    <Th>Место</Th>
                                    <Th>Статус</Th>
                                    <Th>Действия</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {providerGoodsData?.length ? (
                                    providerGoodsData?.map((item, index) => {
                                        const placesLabels = JSON.parse(String(item.place)).map(
                                            (place: { label: string }) => place.label,
                                        )
                                        const providerName = providerData?.find(
                                            (provider) => provider.id == item.providerId,
                                        )
                                        const placesString = placesLabels.join(', ')

                                        return (
                                            <Tr key={index}>
                                                <Td>{index + Number(1)}</Td>
                                                <Td>{item.goods}</Td>
                                                <Td>
                                                    {
                                                        goodsCategories?.find(
                                                            (category) =>
                                                                category.id == item.goodsCategoryId,
                                                        )?.category
                                                    }
                                                </Td>
                                                <Td>{providerName?.providerName}</Td>
                                                <Td>{item.unitOfMeasure}</Td>
                                                <Td>{placesString}</Td>
                                                <Td>{item.status ? 'Активный' : 'Неактивный'}</Td>
                                                <Td sx={{ width: '5%' }}>
                                                    <IconButton
                                                        variant='outline'
                                                        size='sm'
                                                        colorScheme='teal'
                                                        aria-label='Send email'
                                                        marginRight={3}
                                                        onClick={() => {
                                                            setSelectedData(item)
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
                                                            setSelectedData(item)
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
                </Box>
                <Dialog
                    isOpen={dialog.isOpen}
                    onClose={() => {
                        dialog.onClose()
                        setSelectedData(undefined)
                    }}
                    header='Удалить'
                    body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                    actionBtn={() => {
                        dialog.onClose()
                        handlerDeleteProvider(selectedData)
                    }}
                    actionText='Удалить'
                />
                <GoodsAddModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    selectedData={selectedData}
                    onSuccess={handledSuccess}
                />
            </UniversalComponent>
        </>
    )
}

export default AdminGoods
