import { Box, Button, useDisclosure } from '@chakra-ui/react'
import AccordionClients from '@/components/AccordionClients'
import { setDoneStatus } from '@/utils/services/sales.service'
import DateRange from '@/components/DateRange'

import { useApi } from '@/utils/services/axios'
import UniversalComponent from '@/components/ui/UniversalComponent'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { OrderArrayType } from '@/utils/types/order.types'
import { useNotify } from '@/utils/hooks/useNotify'
import RequestAddModal from '../components/RequestAddModal'

const ProcessingPage = () => {
    const { loading } = useNotify()
    const { getURLs } = useURLParameters()
    const { onOpen, isOpen, onClose } = useDisclosure()

    const { data: salesData, mutate: mutateSalesData } = useApi<OrderArrayType[]>(
        `sales?${getURLs().toString()}`,
    )

    const handleChangeStatus = async (clientName: OrderArrayType) => {
        const responsePromise: Promise<any> = setDoneStatus(clientName.id)
        loading(responsePromise)
        responsePromise
            .then(() => {
                mutateSalesData()
            })
            .catch((error) => {
                console.error('Error updating order status:', error)
            })
    }

    const handleClose = () => {
        mutateSalesData()
        onClose()
    }

    return (
        <UniversalComponent>
            <Box width='100%' height='94%' p={5} mt={1}>
                <Box marginBottom={5} height='5%' display='flex' justifyContent='space-between'>
                    <Box
                        width='100%'
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                    >
                        <DateRange />
                        <Button colorScheme='purple' onClick={onOpen}>
                            Добавить закупки
                        </Button>
                    </Box>
                </Box>
                <Box>
                    {salesData && (
                        <AccordionClients
                            data={salesData.filter((sale) => sale.done === 0)}
                            handleChangeStatus={handleChangeStatus}
                        />
                    )}
                </Box>
                {isOpen && (
                    <RequestAddModal
                        isOpen={isOpen}
                        onClose={handleClose}
                        mutate={mutateSalesData}
                    />
                )}
            </Box>
        </UniversalComponent>
    )
}

export default ProcessingPage
