import { Box } from '@chakra-ui/react'
import DebtTransferForm from '../components/DebtTransferForm'

const DebtTransfer = () => {
    return (
        <>
            <Box>
                <Box width='100%' height='100%' p={5}>
                    <DebtTransferForm />
                </Box>
            </Box>
        </>
    )
}

export default DebtTransfer
