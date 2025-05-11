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
import ProductAddModal from '../components/ProductAddModal'
import { useState, useEffect } from 'react'
import { getAllProducts, deleteProduct, findByFilters } from '@/utils/services/product.service.ts'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import Dialog from '@/components/Dialog'
import { useApi } from '@/utils/services/axios'
import { FacilityUnit, Product } from '@/utils/types/product.types'
import { TableContainer, Thead } from '@/components/ui'
import UniversalComponent from '@/components/ui/UniversalComponent'

const AdminPanel = () => {
    const { onOpen, isOpen, onClose } = useDisclosure()

    const { data: dataForSelect } = useApi<Product[]>('product')
    const [filters, setFilters] = useState({ name: '', bakingFacilityUnitId: '', status: '' })

    const { data: facilityUnitsData } = useApi<FacilityUnit[]>('mixers')

    const { data: productsData, isLoading } = useApi<Product[]>('product', filters)

    const [selectedData, setSelectedData] = useState<Product>()
    const [data, setData] = useState<Product[]>([])
    const [dialog, setDialog] = useState({
        isOpen: false,
        onClose: () => setDialog({ ...dialog, isOpen: false }),
    })

    useEffect(() => {
        setData(productsData || [])
    }, [productsData])

    const handleAddProduct = () => {
        getAllProducts().then((responseData) => {
            setData(responseData)
        })
    }

    const delProduct = (selectedData: Product | undefined) => {
        if (selectedData) {
            deleteProduct(selectedData.id).then(() => {
                handleAddProduct()
                setSelectedData(undefined)
            })
        } else {
            console.error('No product data available to delete.')
        }
    }

    const handleClose = () => {
        setSelectedData(undefined)
        onClose()
    }

    useEffect(() => {
        applyFilters()
    }, [filters])

    const applyFilters = async () => {
        findByFilters(filters).then((res) => {
            setData(res.data.data)
        })
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
                    <Box mb={6} display='flex' justifyContent='space-between'>
                        <Box display='flex' gap='15px' width='fit-content'>
                            <Select
                                placeholder='Наименование'
                                width='fit-content'
                                name='name'
                                onChange={handleSelectChange}
                            >
                                {dataForSelect?.map((product, index) => (
                                    <option key={index} value={product.name}>
                                        {product.name}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                placeholder='Цех'
                                width='fit-content'
                                name='bakingFacilityUnitId'
                                onChange={handleSelectChange}
                            >
                                {facilityUnitsData?.map((unit, index) => (
                                    <option key={index} value={unit.id}>
                                        {unit.facilityUnit}
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
                                <Tr position='sticky'>
                                    <Th>№</Th>
                                    <Th>Наименование</Th>
                                    <Th>Цех</Th>
                                    <Th>Статус</Th>
                                    <Th>Цена</Th>
                                    <Th>Себестоимость</Th>
                                    <Th>Действия</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.length ? (
                                    data
                                        ?.sort((a, b) => a.id - b.id)
                                        .map((product, index) => {
                                            const ordinalNumber: number = index + 1
                                            return (
                                                <Tr key={index}>
                                                    <Td>{ordinalNumber}</Td>
                                                    <Td>{product.name}</Td>
                                                    <Td>
                                                        {product.bakingFacilityUnit?.facilityUnit}
                                                    </Td>
                                                    <Td>
                                                        {product.status ? 'Активный' : 'Неактивный'}
                                                    </Td>
                                                    <Td>{product.price.formatted()}</Td>
                                                    <Td>{product.costPrice.formatted()}</Td>
                                                    <Td>
                                                        <IconButton
                                                            variant='outline'
                                                            size='sm'
                                                            colorScheme='teal'
                                                            aria-label='Send email'
                                                            marginRight={3}
                                                            onClick={() => {
                                                                setSelectedData(product)
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
                                                                setSelectedData(product)
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
                    <ProductAddModal
                        data={selectedData}
                        isOpen={isOpen}
                        onClose={handleClose}
                        onAddProduct={handleAddProduct}
                    />
                    <Dialog
                        isOpen={dialog.isOpen}
                        onClose={dialog.onClose}
                        header='Удалить'
                        body='Вы уверены? Вы не сможете отменить это действие впоследствии.'
                        actionBtn={() => {
                            dialog.onClose()
                            delProduct(selectedData)
                        }}
                        actionText='Удалить'
                    />
                </Box>
            </UniversalComponent>
        </>
    )
}

export default AdminPanel
