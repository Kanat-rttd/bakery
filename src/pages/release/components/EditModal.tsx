import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    InputGroup,
    Box,
    Text,
    Select,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { updateDispatchQuantity } from '@/utils/services/dispatch.service'
import { DispatchType } from '@/utils/types/dispatch.types'
import { useNotify } from '@/utils/hooks/useNotify'
import { useApi } from '@/utils/services/axios'
import { ContragentCategoryType, ContragentType } from '@/utils/types/contragent.types'

interface EditModalInputs {
    [key: string]: string
}

interface EditModalProps {
    data: DispatchType | undefined
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
    const { loading } = useNotify()
    const { data: contragentsTypesData } = useApi<ContragentCategoryType[]>('contragentType')
    const { data: clientsData } = useApi<ContragentType[]>(
        `contragent?type=${contragentsTypesData?.find((item) => item.type === 'реализатор')?.id}&status=1`,
    )
    const {
        register,
        handleSubmit: handleSubmitForm,
        formState: { errors },
        setValue,
        setError,
    } = useForm<EditModalInputs>()

    const sendData = (formData: EditModalInputs) => {
        const formattedData = data?.goodsDispatchDetails.map((details, index) => ({
            productId: Number(details.productId),
            quantity: Number(formData[`quantity_${index}`]),
            price: Number(details.price),
        }))
        if (data?.id == undefined || formattedData == undefined) return
        try {
            const responsePromise: Promise<any> = updateDispatchQuantity(data.id, {
                contragentId: Number(formData.contragentId),
                products: formattedData,
            })
            loading(responsePromise)
            responsePromise
                .then(() => {
                    onClose()
                    onSuccess()
                })
                .catch((error: any) => {
                    console.error('Update dispatch quantity error:', error)
                    throw error
                })
        } catch (error: any) {
            setError('root', {
                message: error.response.data.message || 'Ошибка',
            })
        }
    }

    useEffect(() => {
        if (data) {
            setValue('contragentId', data.contragent.id.toString())
            data.goodsDispatchDetails.forEach((details, index) => {
                setValue(`quantity_${index}`, details.quantity.toString())
            })
        }
    }, [data])

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Редактировать</ModalHeader>
                <ModalCloseButton />
                <ModalBody display='flex' flexDirection='column' gap={3}>
                    <FormControl isInvalid={!!errors.name}>
                        <Select
                            {...register('contragentId', {
                                required: 'Поле является обязательным',
                            })}
                            placeholder='Имя *'
                            width='100%'
                        >
                            {clientsData?.map((client, index) => {
                                return (
                                    <option key={index} value={client.id}>
                                        {client.contragentName}
                                    </option>
                                )
                            })}
                        </Select>
                        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                    </FormControl>

                    {data &&
                        data.goodsDispatchDetails.map((details, index) => {
                            return (
                                <Box
                                    display='flex'
                                    flexDirection='row'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    key={index}
                                >
                                    <Text>{details.product.name}</Text>
                                    <FormControl
                                        width='70%'
                                        key={index}
                                        isInvalid={!!errors[`quantity_${index}`]}
                                    >
                                        <InputGroup>
                                            <Input
                                                {...register(`quantity_${index}`, {
                                                    required: 'Поле является обязательным',
                                                })}
                                                autoComplete='off'
                                                placeholder={`Количество ${details.product.name} *`}
                                                type='text'
                                            />
                                        </InputGroup>
                                        <FormErrorMessage>
                                            {(errors as any)[`quantity_${index}`]?.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </Box>
                            )
                        })}
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Закрыть
                    </Button>
                    <Button colorScheme='purple' onClick={handleSubmitForm(sendData)}>
                        Подтвердить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditModal
