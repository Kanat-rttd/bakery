import { Box, Select } from '@chakra-ui/react'
import TableData from '@/components/TableData'
import DateRange from '@/components/DateRange'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import { OrderArrayType } from '@/utils/types/order.types'

interface FacilityUnit {
    id: number
    facilityUnit: string
}

const ProcessedPage = () => {
    const { getURLs, setParam, getParam } = useURLParameters()

    const { data: salesData } = useApi<OrderArrayType[]>(`sales?${getURLs().toString()}`)
    const { data: facilityUnits } = useApi<FacilityUnit[] | undefined>(
        `mixers?${getURLs().toString()}`,
    )

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = event.target
        setParam('facilityUnitId', value)
    }

    return (
        <Box overflowY='hidden'>
            <Box width='100%' p={5} mt={1}>
                <Box mb={8} height='5%' display='flex' justifyContent='space-between'>
                    <Box display='flex' gap='15px' width='fit-content'>
                        <DateRange />
                        <Select
                            placeholder='Цех'
                            name='facilityUnitId'
                            size='sm'
                            borderRadius={5}
                            onChange={handleSelectChange}
                            value={getParam('facilityUnitId')}
                            width='100%'
                        >
                            {facilityUnits?.map((unit, index) => {
                                return (
                                    <option key={index} value={unit.id}>
                                        {unit.facilityUnit}
                                    </option>
                                )
                            })}
                        </Select>
                    </Box>
                </Box>
                <Box height='calc(95% - 2.5rem)'>
                    <TableData data={salesData?.filter((sale) => sale.done === 1)} />
                </Box>
            </Box>
        </Box>
    )
}

export default ProcessedPage
