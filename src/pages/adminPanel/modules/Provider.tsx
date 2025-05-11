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
import ProviderAddModal from '../components/ProviderAddModal'
import { useState } from 'react'
import Dialog from '@/components/Dialog'
import { useApi } from '@/utils/services/axios'
import { TableContainer, Thead } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { ProviderType } from '@/utils/types/provider.types'
import { deleteProvider } from '@/utils/services/provider.service'
import { useNotify } from '@/utils/hooks/useNotify'
import { useURLParameters } from '@/utils/hooks/useURLParameters.tsx'

const AdminProvider = () => {
    const { error, success } = useNotify()
    const { getURLs, getParam, setParam } = useURLParameters()
    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const {
        data: providersData,
        isLoading,
        mutate: mutateProviderData,
    } = useApi<ProviderType[]>(`providers?${getURLs().toString()}`)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedData, setSelectedData] = useState<ProviderType>()

    const handlerDeleteProvider = (selectedData: ProviderType | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteProvider(selectedData.id)
            responsePromise
                .then((res) => {
                    mutateProviderData()
                    success(res.data.message)
                })
                .catch((err) => {
                    error(err.response.data.error)
                })
        } else {
            console.error('No user data available to delete.')
        }
    }

    const handledSuccess = () => {
        mutateProviderData()
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
                                    <Th>Поставщик</Th>
                                    <Th>Статус</Th>
                                    <Th>Действия</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {providersData?.length ? (
                                    providersData?.map((item, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{index + Number(1)}</Td>
                                                <Td>{item.providerName}</Td>
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
                    onClose={dialog.onClose}
                    header='Удалить'
                    body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                    actionBtn={() => {
                        dialog.onClose()
                        handlerDeleteProvider(selectedData)
                    }}
                    actionText='Удалить'
                />
                <ProviderAddModal
                    isOpen={isOpen}
                    onClose={handleClose}
                    selectedData={selectedData}
                    onSuccess={handledSuccess}
                />
            </UniversalComponent>
        </>
    )
}

export default AdminProvider
