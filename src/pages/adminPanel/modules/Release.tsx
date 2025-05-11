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
import ReleaseAddModal from '../components/ReleaseAddModal'
import { useState, useEffect } from 'react'
import { deleteClient, getAllClients } from '@/utils/services/client.service'
import useSWR, { mutate } from 'swr'
import { useApi } from '@/utils/services/axios'
import Dialog from '@/components/Dialog'
import { Thead, TableContainer } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { ReleaserType } from '@/utils/types/releaser.types'
import { useNotify } from '@/utils/hooks/useNotify'

const AdminPanel = () => {
    const { success, error } = useNotify()
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [selectedData, setSelectedData] = useState<ReleaserType | undefined>(undefined)
    const [filters, setFilters] = useState({ name: '', telegrammId: '', status: '' })
    const {
        data: clientsData,
        isLoading,
        mutate: mutateClientsData,
    } = useApi<ReleaserType[]>('client', filters)
    const { data: filtersData } = useSWR<ReleaserType[]>('clientFilter', {
        fetcher: () => getAllClients({ name: '', telegrammId: '', status: '' }),
    })

    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    useEffect(() => {
        mutate(['client', filters])
    }, [filters])

    const onCloseModal = () => {
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

    const handledSuccess = () => {
        mutateClientsData()
    }

    const deleteUser = (selectedData: ReleaserType | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteClient(selectedData.id)
            responsePromise
                .then((res) => {
                    mutateClientsData()
                    success(res.data.message)
                })
                .catch(() => {
                    error('Произошла ошибка')
                })
        } else {
            console.error('No releaser data available to delete.')
        }
        setSelectedData(undefined)
    }

    return (
        <>
            <UniversalComponent>
                <Box display='flex' flexDirection='column' p={5}>
                    <Box marginBottom={6} display='flex' justifyContent='space-between'>
                        <Box display='flex' gap='15px' width='fit-content'>
                            <Select
                                name='name'
                                placeholder='Имя'
                                width='fit-content'
                                onChange={handleSelectChange}
                            >
                                {filtersData?.map((client, index) => (
                                    <option key={index} value={client.name}>
                                        {client.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                name='telegrammId'
                                placeholder='Телеграм ID'
                                width='fit-content'
                                onChange={handleSelectChange}
                            >
                                {filtersData?.map((client, index) => (
                                    <option key={index} value={client.telegrammId}>
                                        {client.telegrammId}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                name='status'
                                placeholder='Статус'
                                width='fit-content'
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
                    <Box>
                        <TableContainer
                            isLoading={isLoading}
                            style={{ width: '100%', height: '100%', overflowY: 'auto' }}
                        >
                            <Table variant='simple'>
                                <Thead>
                                    <Tr position='sticky'>
                                        <Th>№</Th>
                                        <Th>Имя</Th>
                                        <Th>Фамилия</Th>
                                        <Th>Контакты</Th>
                                        <Th>Телеграм ID</Th>
                                        <Th>Статус</Th>
                                        <Th>Действия</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {clientsData?.length ? (
                                        clientsData?.map((user, index) => {
                                            const ordinalNumber: number = index + 1
                                            return (
                                                <Tr key={index}>
                                                    <Td>{ordinalNumber}</Td>
                                                    <Td>{user.name}</Td>
                                                    <Td>{user.surname}</Td>
                                                    <Td>{user.contact.formattedPhone()}</Td>
                                                    <Td>{user.telegrammId}</Td>
                                                    <Td>
                                                        {user.status ? 'Активный' : 'Неактивный'}
                                                    </Td>
                                                    <Td sx={{ width: '5%' }}>
                                                        <IconButton
                                                            variant='outline'
                                                            size='sm'
                                                            colorScheme='teal'
                                                            aria-label='Send email'
                                                            marginRight={3}
                                                            onClick={() => {
                                                                setSelectedData(user)
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
                                                                setSelectedData(user)
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
                </Box>

                <ReleaseAddModal
                    onClose={onCloseModal}
                    isOpen={isOpen}
                    data={selectedData}
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
                        deleteUser(selectedData)
                    }}
                    actionText='Удалить'
                />
            </UniversalComponent>
        </>
    )
}

export default AdminPanel
