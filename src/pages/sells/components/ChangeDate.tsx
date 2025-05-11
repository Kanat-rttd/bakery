import { useNotify } from '@/utils/hooks/useNotify'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { moveDateDispatch } from '@/utils/services/dispatch.service'
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { mutate } from 'swr'

interface Form {
    startDate: string
    endDate: string
    newDate: string
}

export function ChangeDate() {
    const { loading } = useNotify()
    const { isOpen, onClose, onOpen } = useDisclosure()
    const { getParam, getURLs } = useURLParameters()

    const { handleSubmit, reset, setValue, register, setError } = useForm<Form>()

    useEffect(() => {
        if (getParam('startDate') && getParam('endDate')) {
            setValue('startDate', getParam('startDate'))
            setValue('endDate', getParam('endDate'))
        } else {
            reset()
        }
    }, [getParam('startDate'), getParam('endDate')])

    const onSubmit: SubmitHandler<Form> = async (formData) => {
        try {
            const promise: Promise<any> = moveDateDispatch(
                formData.startDate,
                formData.endDate,
                formData.newDate,
            )
            loading(promise)
            promise.then(() => {
                reset()
                onClose()
                mutate(`release?${getURLs().toString()}&status=0`)
            })
        } catch (error: any) {
            setError('root', {
                message: error.response.data.message || 'Ошибка',
            })
        }
    }

    return (
        <>
            <Button size='sm' onClick={onOpen}>
                Сдвинуть дату
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <div>Сдвинуть дату у записей</div>
                        <div>
                            с {dayjs(getParam('startDate')).format('DD.MM.YYYY')} по{' '}
                            {dayjs(getParam('endDate')).format('DD.MM.YYYY')}
                        </div>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            <FormControl>
                                <Text>Новая дата</Text>
                                <Input {...register('newDate', { required: true })} type='date' />
                            </FormControl>
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
                                    value='Редактировать'
                                />
                            </Box>
                        </form>
                    </ModalBody>
                    <ModalFooter />
                </ModalContent>
            </Modal>
        </>
    )
}

