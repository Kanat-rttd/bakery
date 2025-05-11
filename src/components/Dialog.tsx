import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
} from '@chakra-ui/react'
import { MutableRefObject, ReactNode, useRef } from 'react'

interface DialogProps {
    isOpen: boolean
    onClose: () => void
    header: string
    body: ReactNode
    actionBtn: () => void
    actionText: string
}

const Dialog: React.FC<DialogProps> = ({
    isOpen,
    onClose,
    header,
    body,
    actionBtn,
    actionText,
}) => {
    const cancelRef: MutableRefObject<null> = useRef(null)

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        {header}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <Box>{body}</Box>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                            Отмена
                        </Button>
                        <Button colorScheme='red' ml={3} onClick={actionBtn}>
                            {actionText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default Dialog
