import {
    Table,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    IconButton,
    useDisclosure,
    Button,
    Select,
} from '@chakra-ui/react'
import UserAddModal from '../components/UserAddModal'
import { useState } from 'react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

import { useApi } from '@/utils/services/axios'
import Dialog from '@/components/Dialog'
import { deleteUser } from '@/utils/services/user.service'
import { User } from '@/utils/types/user.types'
import { TableContainer, Thead } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useNotify } from '@/utils/hooks/useNotify'

const AdminPanel = () => {
    const { loading } = useNotify()
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [selectedData, setSelectedData] = useState<User | undefined>(undefined)
    const [selectedStatus, setSelectedStatus] = useState<string>('')
    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    const {
        data: usersData,
        isLoading,
        mutate: mutateUserData,
    } = useApi<User[]>('user', {
        status: selectedStatus,
    })

    const handleClose = () => {
        setSelectedData(undefined)
        onClose()
    }

    const handledSuccess = () => {
        mutateUserData()
    }

    const applyFilters = (status: string) => {
        setSelectedStatus(status)
    }

    const handlerDeleteUser = (selectedData: User | undefined) => {
        if (selectedData) {
            const responsePromise: Promise<any> = deleteUser(selectedData.id)
            loading(responsePromise)
            responsePromise.then(() => {
                mutateUserData()
            })
        } else {
            console.error('No user data available to delete.')
        }
        setSelectedData(undefined)
    }

    return (
        <>
            <UniversalComponent>
                <Box display='flex' flexDirection='column' p={5}>
                    <Box marginBottom={6} display='flex' justifyContent='space-between'>
                        <Box display='flex' gap='15px' width='100%'>
                            <Select
                                placeholder='Статус'
                                width='20%'
                                size='sm'
                                borderRadius={5}
                                justifyContent='space-between'
                                onChange={(e) => applyFilters(e.target.value)}
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
                                    <Th>Имя</Th>
                                    <Th>Фамилия</Th>
                                    <Th>Телефон</Th>
                                    <Th>Статус</Th>
                                    <Th>Должность</Th>
                                    <Th>Фикс Зп.</Th>
                                    <Th>Действия</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {usersData?.length ? (
                                    usersData
                                        .filter((user) => user.name !== 'Default User')
                                        ?.map((user, index) => {
                                            const ordinalNumber: number = index + 1
                                            return (
                                                <Tr key={index}>
                                                    <Td>{ordinalNumber}</Td>
                                                    <Td>{user.name}</Td>
                                                    <Td>{user.surname}</Td>
                                                    <Td>{user.phone.formattedPhone()}</Td>
                                                    <Td>
                                                        {user.status ? 'Активный' : 'Неактивный'}
                                                    </Td>
                                                    <Td>{user.userClass}</Td>
                                                    <Td>{Number(user.fixSalary).formatted()}</Td>
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
                    <UserAddModal
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
                            handlerDeleteUser(selectedData)
                        }}
                        actionText='Удалить'
                    />
                </Box>
            </UniversalComponent>
        </>
    )
}

export default AdminPanel
