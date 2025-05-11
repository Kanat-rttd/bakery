import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react'

interface EditModalProps {
    isOpen: boolean
    onClose: () => void
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{/* <Lorem count={2} /> */}</ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Закрыть
                    </Button>
                    <Button colorScheme='purple'>Подтвердить</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditModal
