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
import { useState } from 'react'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import Dialog from '@/components/Dialog'
import { useApi } from '@/utils/services/axios'
import MagazineAddModal from '../components/MagazineAddModal'
import { deleteMagazines } from '@/utils/services/magazines.service'
import { TableContainer, Thead } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { MagazineType } from '@/utils/types/magazine.type'
import { ClientType } from '@/utils/types/client.type'
import { useNotify } from '@/utils/hooks/useNotify'

const AdminPanel = () => {
    const { success, error } = useNotify()
    const [filters, setFilters] = useState({ name: '', clientId: '', status: '' })
    const { data: magazinesDataForSelect } = useApi<MagazineType[]>('magazines')

    const {
        data: magazinesData,
        isLoading,
        mutate: mutateMagazinesData,
    } = useApi<MagazineType[]>('magazines', filters)
    const { data: clientsData } = useApi<ClientType[]>('client')

    const { onOpen, isOpen, onClose } = useDisclosure()
    const [selectedData, setSelectedData] = useState<MagazineType>()

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const handledSuccess = () => {
        mutateMagazinesData()
    }

    const deleteMagazine = (selectedData: MagazineType | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteMagazines(selectedData.id)

            responsePromise.then((res) => {
                mutateMagazinesData()
                success(res.data.message)
            })
        } else {
            console.error('No user data available to delete.')
            error('Произошла ошибка')
        }
    }

    const handleClose = () => {
        setSelectedData(undefined)
        onClose()
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }))
    }

    return (
        <>
            <UniversalComponent>
                <Box display='flex' flexDirection='column' p={5}>
                    <Box mb={5} mt={1} display='flex' justifyContent='space-between'>
                        <Box display='flex' gap='15px' width='fit-content'>
                            <Select
                                placeholder='Магазины'
                                width='fit-content'
                                name='name'
                                onChange={handleSelectChange}
                            >
                                {magazinesDataForSelect?.map((product, index) => (
                                    <option key={index} value={product.name}>
                                        {product.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder='Реализатор'
                                width='fit-content'
                                name='clientId'
                                onChange={handleSelectChange}
                            >
                                {clientsData?.map((unit, index) => (
                                    <option key={index} value={unit.id}>
                                        {unit.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder='Статус'
                                width='fit-content'
                                name='status'
                                onChange={handleSelectChange}
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
                                    <Th>Магазин</Th>
                                    <Th>Реализатор</Th>
                                    <Th>Статус</Th>
                                    <Th>Действия</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {magazinesData?.length ? (
                                    magazinesData?.map((item, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{item.id}</Td>
                                                <Td>{item.name}</Td>
                                                <Td>{item.client.name}</Td>
                                                <Td>{item.status ? 'Активный' : 'Неактивный'}</Td>
                                                <Td>
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
                    <MagazineAddModal
                        data={selectedData}
                        isOpen={isOpen}
                        onClose={handleClose}
                        onSuccess={handledSuccess}
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
                            dialog.onClose()
                            deleteMagazine(selectedData)
                            setSelectedData(undefined)
                        }}
                        actionText='Удалить'
                    />
                </Box>
            </UniversalComponent>
        </>
    )
}

export default AdminPanel
