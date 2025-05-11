import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    FormControl,
    FormErrorMessage,
    InputGroup,
    Input,
    InputRightAddon,
    Text,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import Select from 'react-select'
import { useEffect } from 'react'
import { updateFactInput } from '@/utils/services/factInput.service'
import { useApi } from '@/utils/services/axios'
import { AddFactModalInputs, FactInputTableData } from '@/utils/types/factInput.types'
import { useNotify } from '@/utils/hooks/useNotify'

const defaultValues = {
    id: 0,
    name: '',
    place: '',
    unitOfMeasure: '',
    quantity: '',
    updatedAt: '',
}

type EditModalProps = {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    selectedData: FactInputTableData | undefined
}

interface Place {
    label: string
}

const EditModal = ({ isOpen, onClose, selectedData, onSuccess }: EditModalProps) => {
    const { loading } = useNotify()
    const { data: placesData } = useApi<Place[]>('place')
    const {
        register,
        handleSubmit: handleSubmitForm,
        control,
        formState: { errors },
        setValue,
        reset,
    } = useForm<AddFactModalInputs>()

    useEffect(() => {
        if (selectedData) {
            setValue('place', selectedData.place)
            setValue('quantity', String(selectedData.quantity))
        }
    }, [selectedData])

    const updateData = (formData: AddFactModalInputs) => {
        const name = selectedData?.goodsCategory.category || ''
        const id = selectedData?.id || 0
        const quantity = parseFloat(formData.quantity)

        const sendData = { ...formData, name, quantity }

        const responsePromise: Promise<any> = updateFactInput(id, sendData)
        loading(responsePromise)
        responsePromise
            .then(() => {
                onSuccess()
                handleClose()
                reset()
            })
            .catch((error) => {
                console.error('Error updating data:', error)
            })
    }

    const handleClose = () => {
        reset(defaultValues)
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Изменить</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box display='flex' flexDirection='column' gap={3}>
                        <FormControl isInvalid={!!errors.place}>
                            <Controller
                                name='place'
                                control={control}
                                rules={{ required: 'Поле является обязательным' }}
                                render={({ field }) => {
                                    const { onChange, value } = field
                                    return (
                                        <Select
                                            options={placesData || []}
                                            getOptionLabel={(option: Place) => option.label}
                                            getOptionValue={(option: Place) => `${option.label}`}
                                            value={placesData?.filter(
                                                (option) => String(option.label) == value,
                                            )}
                                            onChange={(selectedOption: Place | null) => {
                                                if (selectedOption) {
                                                    onChange(selectedOption.label)
                                                }
                                            }}
                                            placeholder='Место *'
                                            isClearable
                                            isSearchable
                                        />
                                    )
                                }}
                            />
                            <FormErrorMessage>{errors.place?.message}</FormErrorMessage>
                        </FormControl>

                        <Box
                            display='flex'
                            flexDirection='row'
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <Text>{selectedData?.goodsCategory.category}</Text>
                            <FormControl isInvalid={!!errors.quantity} width='70%'>
                                <InputGroup>
                                    <Input
                                        {...register('quantity', {
                                            required: 'Поле является обязательным',
                                        })}
                                        autoComplete='off'
                                        placeholder='Количество. *'
                                        type='string'
                                    />
                                    <InputRightAddon>
                                        {selectedData?.goodsCategory.unitOfMeasure}
                                    </InputRightAddon>
                                </InputGroup>
                                <FormErrorMessage>{errors.quantity?.message}</FormErrorMessage>
                            </FormControl>
                        </Box>
                    </Box>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='red' mr={3} onClick={handleClose}>
                        Отмена
                    </Button>
                    <Button colorScheme='purple' onClick={handleSubmitForm(updateData)}>
                        Изменить
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditModal
