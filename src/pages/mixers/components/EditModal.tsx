import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormErrorMessage,
    Input,
    InputGroup,
    Box,
    Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useNotify } from '@/utils/hooks/useNotify'
import { ShiftAccountingType } from '@/utils/types/shiftAccounting.types'
import dayjs from 'dayjs'
import { updateShiftAccounting } from '@/utils/services/shiftAccounting.service'

interface EditModalInputs {
    [key: string]: string
}

interface EditModalProps {
    data: ShiftAccountingType | undefined
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, data, onSuccess }) => {
    const { loading } = useNotify()
    const {
        register,
        handleSubmit: handleSubmitForm,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EditModalInputs>()

    useEffect(() => {
        if (data) {
            setValue('date', dayjs(data.date).format('YYYY-MM-DD'))
        } else {
            reset()
        }
    }, [data, isOpen, reset])

    const handleConfirm = (formData: EditModalInputs) => {
        const shiftAccountigId = data?.id?.toString() ?? ''

        const formattedData = data?.shiftAccountingDetails.map((details, index) => ({
            date: formData.date,
            shiftAccountingDetailsId: details.id,
            shiftAccountingId: data?.id,
            departPersonalId: details.departPersonalId,
            shiftTime: formData[`quantity_${index}`],
        }))

        const responsePromise: Promise<any> = updateShiftAccounting(shiftAccountigId, formattedData)
        loading(responsePromise)
        responsePromise
            .then(() => {
                onSuccess()
                onClose()
            })
            .catch((error: any) => {
                console.error('Error creating sale:', error)
            })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Редактировать</ModalHeader>
                <ModalCloseButton />
                <ModalBody display='flex' flexDirection='column' gap={3}>
                    <form
                        onSubmit={handleSubmitForm(handleConfirm)}
                        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                    >
                        <FormControl isInvalid={!!errors.date}>
                            <Input
                                {...register('date', {
                                    required: 'Поле является обязательным',
                                })}
                                autoComplete='off'
                                placeholder='Дата *'
                                type='date'
                                defaultValue={new Date().toISOString().split('T')[0]}
                            />
                            <FormErrorMessage>{errors.date?.message}</FormErrorMessage>
                        </FormControl>
                        <Box
                            display='flex'
                            flexDirection='column'
                            // alignItems={'center'}
                            gap={2}
                            justifyContent='space-between'
                            ml={1}
                        >
                            {data &&
                                data.shiftAccountingDetails.map((details, index) => {
                                    return (
                                        <Box
                                            display='flex'
                                            flexDirection='row'
                                            alignItems='center'
                                            justifyContent='space-between'
                                            key={index}
                                        >
                                            <Text>{details.departPersonal.name}</Text>
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
                                                        placeholder='Часы *'
                                                        type='text'
                                                        defaultValue={details.shiftTime}
                                                    />
                                                </InputGroup>
                                                <FormErrorMessage>
                                                    {(errors as any)[`quantity_${index}`]?.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </Box>
                                    )
                                })}
                            {/* <Text>{data?.shiftAccountingDetails[0].departPersonal.name}</Text>
                            <FormControl width={'70%'} isInvalid={!!errors.hours}>
                                <InputGroup>
                                    <Input
                                        {...register(`hours`, {
                                            required: 'Поле является обязательным',
                                        })}
                                        autoComplete="off"
                                        placeholder={`Часы *`}
                                        defaultValue={data?.shiftAccountingDetails[0].shiftTime}
                                        type="text"
                                    />
                                </InputGroup>
                                <FormErrorMessage>{errors.hours?.message}</FormErrorMessage>
                            </FormControl> */}
                        </Box>
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: '10px',
                            }}
                        >
                            <Input
                                width='40%'
                                type='submit'
                                bg='purple.500'
                                color='white'
                                cursor='pointer'
                                value={data ? 'Редактировать' : 'Добавить'}
                            />
                        </Box>
                    </form>
                </ModalBody>

                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditModal
