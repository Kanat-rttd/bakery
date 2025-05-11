import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Stack,
    ModalFooter,
    ModalOverlay,
    Input,
    Box,
    Select,
    FormControl,
    FormErrorMessage,
    FormLabel,
    InputGroup,
    InputRightAddon,
    Button,
    Flex,
} from '@chakra-ui/react'

import { createBaking, updateBaking } from '@/utils/services/baking.service'
import { useEffect } from 'react'
import { useApi } from '@/utils/services/axios'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { BakingDataType } from '@/utils/types/baking.types'
import dayjs from 'dayjs'
import InputNumber from '@/components/shared/NumberInput'
import { useNotify } from '@/utils/hooks/useNotify'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'

interface ClientAddModalProps {
    data?: BakingDataType | null
    isOpen: boolean
    quantity?: number
    onClose: () => void
    onSuccess: () => void
}

type GoodsCategoryType = {
    id: number
    category: string
    unitOfMeasure: string
}

const BakingAddModal = ({ data, isOpen, onClose, onSuccess }: ClientAddModalProps) => {
    const { loading } = useNotify()
    const {
        register,
        handleSubmit: handleSubmitForm,
        setValue,
        setError,
        formState: { errors },
        reset,
        control,
    } = useForm<BakingDataType>()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'bakingDetails',
        rules: {
            required: 'Обязательно',
        },
    })
    const watch = useWatch({ control, name: 'bakingDetails' })

    const { data: products } = useApi<{ id: string; name: string }[]>('product?status=1')
    const { data: goodsCategoriesData } = useApi<GoodsCategoryType[]>('goodsCategories')

    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                setValue(key as keyof BakingDataType, value)
            })
            setValue('dateTime', dayjs(data.dateTime).format('YYYY-MM-DD HH:mm'))
        } else {
            reset()
            remove()
        }
    }, [data, isOpen, reset])

    const sendData = (formData: BakingDataType) => {
        console.log(formData)

        const responsePromise: Promise<any> = data
            ? updateBaking(data.id, { ...formData })
            : createBaking({ ...formData })

        loading(responsePromise)

        responsePromise
            .then(() => {
                reset()
                remove()
                onSuccess()
                onClose()
            })
            .catch((error) => {
                setError(error.response.data.field, {
                    message: error.response.data.message || 'Ошибка',
                })
            })
    }

    const handleModalClose = () => {
        reset()
        onClose()
    }

    return (
        <Modal size='lg' isCentered isOpen={isOpen} onClose={handleModalClose}>
            <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(10px) hue-rotate(90deg)' />
            <ModalContent>
                <ModalHeader>Добавить заказ</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        <form
                            onSubmit={handleSubmitForm(sendData)}
                            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                        >
                            <FormControl isInvalid={!!errors.breadType} isRequired>
                                <FormLabel fontWeight='bold'>Вид хлеба</FormLabel>
                                <Select
                                    {...register('breadType', {
                                        required: 'Поле является обязательным',
                                    })}
                                    variant='filled'
                                    placeholder=''
                                    defaultValue={data ? data.product?.id : ''}
                                >
                                    <option disabled value=''>
                                        Выберите хлеб
                                    </option>
                                    {products?.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </Select>
                                <FormErrorMessage>{errors.breadType?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired isInvalid={!!errors.bakingDetails}>
                                <FormLabel fontWeight='bold'>Материалы</FormLabel>
                                <FormErrorMessage>
                                    {errors.bakingDetails?.root?.message}
                                </FormErrorMessage>
                                {fields.map((field, index) => {
                                    return (
                                        <FormControl
                                            isRequired
                                            isInvalid={!!errors.bakingDetails?.[index]?.message}
                                        >
                                            <Flex mt={2} flexDirection='row' gap={2} key={field.id}>
                                                <Select
                                                    isInvalid={!!errors.bakingDetails?.[index]}
                                                    {...register(
                                                        `bakingDetails.${index}.goodsCategoryId`,
                                                        {
                                                            required: 'Поле является обязательным',
                                                            valueAsNumber: true,
                                                            validate: (v) => {
                                                                if (isNaN(v)) {
                                                                    return false
                                                                }
                                                            },
                                                        },
                                                    )}
                                                >
                                                    <option disabled value={NaN}>
                                                        Выберите категорию
                                                    </option>
                                                    {goodsCategoriesData?.map(
                                                        ({ id, category }) => (
                                                            <option
                                                                hidden={fields.some(
                                                                    (field) =>
                                                                        field.goodsCategoryId ===
                                                                        id,
                                                                )}
                                                                key={id}
                                                                value={id}
                                                            >
                                                                {category}
                                                            </option>
                                                        ),
                                                    )}
                                                </Select>
                                                <InputGroup>
                                                    <Input
                                                        isRequired
                                                        type='number'
                                                        autoComplete='off'
                                                        placeholder='Количество'
                                                        min='0'
                                                        step='0.01'
                                                        onKeyDown={(e) => {
                                                            if (e.key === '-') {
                                                                e.preventDefault()
                                                            }
                                                            if (e.key === 'e') {
                                                                e.preventDefault()
                                                            }
                                                            if (
                                                                e.key === 'ArrowUp' ||
                                                                e.key === 'ArrowDown'
                                                            ) {
                                                                e.preventDefault()
                                                            }
                                                        }}
                                                        {...register(
                                                            `bakingDetails.${index}.quantity`,
                                                            {
                                                                required: true,
                                                                valueAsNumber: true,
                                                            },
                                                        )}
                                                    />
                                                    {watch?.[index]?.goodsCategoryId && (
                                                        <InputRightAddon
                                                            w='15%'
                                                            display='flex'
                                                            justifyContent='center'
                                                        >
                                                            {
                                                                goodsCategoriesData?.find(
                                                                    (category) =>
                                                                        category.id ===
                                                                        watch?.[index]
                                                                            ?.goodsCategoryId,
                                                                )?.unitOfMeasure
                                                            }
                                                        </InputRightAddon>
                                                    )}
                                                </InputGroup>

                                                <Button onClick={() => remove(index)}>
                                                    <DeleteIcon />
                                                </Button>
                                            </Flex>
                                        </FormControl>
                                    )
                                })}
                            </FormControl>

                            <Button
                                size='sm'
                                onClick={() =>
                                    append({
                                        goodsCategoryId: NaN,
                                        quantity: undefined,
                                    })
                                }
                            >
                                <AddIcon />
                            </Button>
                            <FormControl isInvalid={!!errors.dateTime} isRequired>
                                <FormLabel fontWeight='bold'>Дата и время</FormLabel>
                                <Input
                                    {...register('dateTime', {
                                        required: 'Поле является обязательным',
                                    })}
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        border: '1px solid #e3e3e3',
                                        borderRadius: '5px',
                                        padding: '0 15px',
                                    }}
                                    type='datetime-local'
                                    defaultValue={
                                        data
                                            ? dayjs(data.dateTime).format('YYYY-MM-DD HH:mm')
                                            : dayjs().format('YYYY-MM-DD HH:mm')
                                    }
                                />
                                <FormErrorMessage>{errors.dateTime?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.output} isRequired>
                                <FormLabel fontWeight='bold'>Выход</FormLabel>
                                <InputNumber
                                    {...register('output', {
                                        required: 'Поле является обязательным',
                                    })}
                                    placeholder=''
                                />
                                <FormErrorMessage>{errors.output?.message}</FormErrorMessage>
                            </FormControl>
                            <FormControl isInvalid={!!errors.defective} isRequired>
                                <FormLabel fontWeight='bold'>Брак</FormLabel>
                                <InputNumber
                                    {...register('defective', {
                                        required: 'Поле является обязательным',
                                    })}
                                    placeholder=''
                                />
                                <FormErrorMessage>{errors.defective?.message}</FormErrorMessage>
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
                                    value={data ? 'Редактировать' : 'Добавить'}
                                />
                            </Box>
                        </form>
                    </Stack>
                </ModalBody>
                <ModalFooter display='flex' alignSelf='center' gap={5}></ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default BakingAddModal
