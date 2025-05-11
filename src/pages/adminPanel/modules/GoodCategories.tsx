import Dialog from '@/components/Dialog'
import { TableContainer } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useState } from 'react'
import GoodsCategoryModal from '../components/GoodsCategoryModal'
import { mutate } from 'swr'
import { deleteGoodsCategory } from '@/utils/services/goodsCategory.service'
import { useNotify } from '@/utils/hooks/useNotify'

type GoodsCategory = {
    id: number
    category: string
    unitOfMeasure: string
    createdAt: Date
}

export default function GoodCategories() {
    const { success, error } = useNotify()
    const { getURLs } = useURLParameters()
    const { data: goodsCategories, isLoading } = useApi<GoodsCategory[]>(
        `goodsCategories?${getURLs().toString()}`,
    )

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedData, setSelectedData] = useState<GoodsCategory | undefined>(undefined)

    const handleDelete = (selectedData: GoodsCategory | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteGoodsCategory(selectedData.id)
            responsePromise
                .then((res) => {
                    mutate(`goodsCategories?${getURLs().toString()}`)
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

    const handleSuccess = () => {
        mutate(`goodsCategories?${getURLs().toString()}`)
        setSelectedData(undefined)
    }

    const handleClose = () => {
        setSelectedData(undefined)
        onClose()
    }

    return (
        <UniversalComponent>
            <Box width='100%' height='100%' p={5}>
                <Box marginBottom={5} display='flex' justifyContent='space-between'>
                    <Box display='flex' gap='15px' width='fit-content'></Box>
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
                                <Th>Название категории</Th>
                                <Th>Единица измерения</Th>
                                <Th>Дата добавления</Th>
                                <Th>Действия</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {goodsCategories?.length &&
                                goodsCategories.map((category, index) => {
                                    return (
                                        <Tr key={category.id}>
                                            <Td>{index + 1}</Td>
                                            <Td>{category.category}</Td>
                                            <Td>{category.unitOfMeasure}</Td>
                                            <Td>
                                                {dayjs(category.createdAt).format('DD.MM.YYYY')}
                                            </Td>
                                            <Td sx={{ width: '5%' }}>
                                                <IconButton
                                                    variant='outline'
                                                    size='sm'
                                                    colorScheme='teal'
                                                    aria-label='Send email'
                                                    marginRight={3}
                                                    icon={<EditIcon />}
                                                    onClick={() => {
                                                        setSelectedData(category)
                                                        onOpen()
                                                    }}
                                                />
                                                <IconButton
                                                    variant='outline'
                                                    size='sm'
                                                    colorScheme='teal'
                                                    aria-label='Send email'
                                                    marginRight={3}
                                                    icon={<DeleteIcon />}
                                                    onClick={() => {
                                                        setSelectedData(category)
                                                        setDialog({
                                                            ...dialog,
                                                            isOpen: true,
                                                        })
                                                    }}
                                                />
                                            </Td>
                                        </Tr>
                                    )
                                })}
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
                    handleDelete(selectedData)
                }}
                actionText='Удалить'
            />
            <GoodsCategoryModal
                isOpen={isOpen}
                onClose={handleClose}
                onSuccess={handleSuccess}
                selectedData={selectedData}
            />
        </UniversalComponent>
    )
}

