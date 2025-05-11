// import {
//     Modal,
//     ModalContent,
//     ModalHeader,
//     ModalCloseButton,
//     ModalBody,
//     Stack,
//     ModalFooter,
//     ModalOverlay,
//     Button,
//     InputGroup,
//     Input,
// } from '@chakra-ui/react'

// import { ChangeEvent, useEffect, useState } from 'react'
// import { createClient, updateClient } from '../../../utils/services/client.service'

// import { ClientList } from '../../../utils/types/types'

// interface ClientAddModalProps {
//     data: ClientList | undefined
//     isOpen: boolean
//     onClose: () => void
// }

// const ClientAddModal = ({ data, isOpen, onClose }: ClientAddModalProps) => {
//     const [formData, setFormData] = useState({ name: '', email: '' })
//     useEffect(() => {
//         if (data) {
//             setFormData(data)
//         }
//     }, [data])

//     const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = target
//         setFormData({
//             ...formData,
//             [name]: value,
//         })
//     }

//     const addClient = () => {
//         createClient(formData).then((res) => {
//             console.log(res)
//         })
//         onClose()
//     }

//     const updClient = () => {
//         if (data) {
//             updateClient(data.id, formData).then((res) => {
//                 console.log(res)
//             })
//         }
//         onClose()
//     }

//     return (
//         <Modal isCentered isOpen={isOpen} onClose={onClose}>
//             <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) hue-rotate(90deg)" />
//             <ModalContent>
//                 <ModalHeader>{data ? 'Редактировать' : 'Добавить'} клиента</ModalHeader>
//                 <ModalCloseButton />
//                 <ModalBody>
//                     <Stack spacing={4}>
//                         <InputGroup>
//                             <Input
//                                 name="name"
//                                 onChange={handleChange}
//                                 placeholder="Имя клиента"
//                                 value={formData?.name ?? ''}
//                             />
//                         </InputGroup>

//                         <InputGroup>
//                             <Input
//                                 name="email"
//                                 onChange={handleChange}
//                                 placeholder="Почта клиента"
//                                 value={formData?.email ?? ''}
//                             />
//                         </InputGroup>
//                     </Stack>
//                 </ModalBody>
//                 <ModalFooter display={'flex'} alignSelf={'center'} gap={5}>
//                     <Button onClick={data ? updClient : addClient}>
//                         {data ? 'Редактировать' : 'Добавить'} клиента
//                     </Button>
//                     <Button onClick={onClose}>Закрыть</Button>
//                 </ModalFooter>
//             </ModalContent>
//         </Modal>
//     )
// }

// export default ClientAddModal
