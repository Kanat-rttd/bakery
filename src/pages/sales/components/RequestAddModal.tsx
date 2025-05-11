import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    ModalFooter,
    ModalOverlay,
    Button,
    InputGroup,
    Input,
    Box,
    Select,
} from '@chakra-ui/react'

import { ChangeEvent, useState, useEffect } from 'react'
import { getAllProducts } from '@/utils/services/product.service'
import { getAllClients } from '@/utils/services/client.service'
import { createRequest } from '@/utils/services/request.service'

interface ClientAddModalProps {
    isOpen: boolean
    quantity: number
    onClose: () => void
}

interface Clients {
    id: number
    name: string
    email: string
}

interface Products {
    id: number
    name: string
    bakeryType: string
}

const modalData = {
    name: '',
    items: [{ bakeryType: '', quantity: '' }],
}

const RequestAddModal = ({ isOpen, onClose }: ClientAddModalProps) => {
    const [dataClients, setDataClients] = useState<Clients[]>([])
    const [dataProducts, setDataProducts] = useState<Products[]>([])
    const [formData, setFormData] = useState(modalData)
    const [transformedData, setTransformedData] = useState<any[]>([])

    useEffect(() => {
        Promise.all([getAllClients({ name: '', telegrammId: '', status: '' }), getAllProducts()])
            .then(([clientsData, productsData]) => {
                setDataClients(clientsData)
                setDataProducts(productsData)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const handleChange =
        (index: number, field: string) =>
        ({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { value } = target
            const newItems = [...formData.items]
            newItems[index] = { ...newItems[index], [field]: value }

            if (index === formData.items.length - 1) {
                newItems.push({ bakeryType: '', quantity: '' })
            }

            setFormData({
                ...formData,
                items: newItems,
            })

            const transformedData = newItems
                .filter((item) => item.bakeryType !== '' && item.quantity !== '')
                .map((item) => ({
                    clientId: formData.name,
                    productId: item.bakeryType,
                    quantity: item.quantity,
                }))

            setTransformedData(transformedData)
        }

    const handleNameChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        setFormData({
            ...formData,
            name: value,
        })
    }

    const addRequest = () => {
        try {
            createRequest(transformedData).then((res) => {
                console.log(res)
            })
            onClose()
        } catch (error) {
            console.error(error)
        }
    }

    const handleModalClose = () => {
        setFormData(modalData)
        onClose()
    }

    // const updClient = () => {
    //     if (data) {
    //         updateClient(data.id, formData).then((res) => {
    //             console.log(res)
    //         })
    //     }
    //     onClose()
    // }

    return (
        <Modal isCentered isOpen={isOpen} onClose={handleModalClose}>
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
            <ModalContent>
                <ModalHeader>Добавить заказ</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        <Select
                            variant='filled'
                            placeholder='Имя клиента'
                            name='name'
                            onChange={handleNameChange}
                            value={formData?.name ?? ''}
                        >
                            {dataClients.map((client, index) => (
                                <option key={index} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </Select>

                        {formData.items.map((item, index) => (
                            <Box key={index} display='flex'>
                                <Select
                                    variant='filled'
                                    placeholder='Вид хлеба'
                                    name={`bakeryType-${index}`}
                                    onChange={handleChange(index, 'bakeryType')}
                                    value={item.bakeryType}
                                >
                                    {dataProducts.map((product, index) => (
                                        <option key={index} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </Select>

                                <InputGroup paddingLeft={15}>
                                    <Input
                                        name={`quantity-${index}`}
                                        onChange={handleChange(index, 'quantity')}
                                        placeholder='Количество'
                                        value={item.quantity}
                                    />
                                </InputGroup>
                            </Box>
                        ))}
                    </Stack>
                </ModalBody>
                <ModalFooter display='flex' alignSelf='center' gap={5}>
                    <Button onClick={addRequest}>Добавить заказ</Button>
                    <Button onClick={handleModalClose}>Закрыть</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default RequestAddModal
