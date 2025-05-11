import {
    Box,
    Button,
    Checkbox,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Text,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'

import { getBreadNames } from '@/utils/services/product.service'
import { getAllClients } from '@/utils/services/client.service'
import { createDispatch } from '@/utils/services/dispatch.service'

interface DistributionModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    onSuccess: () => void
    status: string
}

interface Client {
    id: number
    name: string
}

interface BreadNames {
    id: string
    bread: string
}

const DistributionModal: React.FC<DistributionModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    status,
}) => {
    const [breadNames, setBreadNames] = useState<BreadNames[]>([])
    const [clientsData, setClientsData] = useState<Client[]>([])

    useEffect(() => {
        getBreadNames().then((responseData) => {
            setBreadNames(responseData)
        })
    }, [])

    useEffect(() => {
        getAllClients({ name: '', telegrammId: '', status: '' }).then((responseData) => {
            setClientsData(responseData)
        })
    }, [])

    const [recipient, setRecipient] = useState<string>('')
    const [selectedBreads, setSelectedBreads] = useState<
        { id: string; name: string; quantity: number }[]
    >([])

    const handleRecipientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setRecipient(event.target.value)
    }

    const handleBreadSelection = (bread: string, id: string) => {
        if (selectedBreads.find((item) => item.name === bread)) {
            setSelectedBreads(
                selectedBreads.map((item) =>
                    item.name === bread ? { ...item, quantity: item.quantity + 1 } : item,
                ),
            )
        } else {
            setSelectedBreads([...selectedBreads, { name: bread, id: id, quantity: 1 }])
        }
    }

    const handleQuantityChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        breadName: string,
    ) => {
        const quantity = parseInt(event.target.value)
        setSelectedBreads(
            selectedBreads.map((bread) =>
                bread.name === breadName ? { ...bread, quantity } : bread,
            ),
        )
    }

    const handleConfirm = () => {
        const distributionData = {
            contragentId: Number(recipient),
            products: selectedBreads.map(({ id, quantity }) => ({
                productId: Number(id),
                quantity: Number(quantity),
                productPrice: undefined,
            })),
            dispatch: status,
        }
        createDispatch(distributionData)
            .then((res) => {
                console.log(res)
                onSuccess()
            })
            .catch((error) => {
                console.error('Error creating sale:', error)
            })

        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{status == '0' ? 'Выдача' : 'Возврат'} продукции</ModalHeader>
                <ModalCloseButton />
                <ModalBody display='flex' gap='10px' flexDirection='column'>
                    <Select
                        placeholder='Выберите получателя'
                        width='100%'
                        onChange={handleRecipientChange}
                        value={recipient}
                    >
                        {clientsData?.map((client, index) => {
                            return (
                                <option key={index} value={client.id}>
                                    {client.name}
                                </option>
                            )
                        })}
                    </Select>

                    <Box
                        display='grid'
                        gridTemplateColumns='repeat(3, 1fr)'
                        gap='10px'
                        border='1px solid #E2E8F0'
                        padding='5px'
                        borderRadius='8px'
                        marginTop='5px'
                    >
                        {breadNames.map((bread) => {
                            return (
                                <Checkbox
                                    checked={selectedBreads.some(
                                        (item) => item.name === bread.bread,
                                    )}
                                    onChange={() => handleBreadSelection(bread.bread, bread.id)}
                                    key={bread.bread}
                                >
                                    {bread.bread}
                                </Checkbox>
                            )
                        })}
                    </Box>

                    <Box display='flex' flexDirection='column' gap='10px'>
                        {selectedBreads.map(({ name, quantity }) => {
                            return (
                                <Box display='flex' gap='10px' key={name}>
                                    <Text>{name}</Text>
                                    <Input
                                        type='number'
                                        placeholder='Кол-во'
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(e, name)}
                                    />
                                </Box>
                            )
                        })}
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button mr={3} onClick={onClose} colorScheme='red'>
                        Отмена
                    </Button>
                    <Button colorScheme='purple' onClick={handleConfirm}>
                        Подтвердить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default DistributionModal
