import { Box, Select } from '@chakra-ui/react'
import TableData from '@/components/TableData'
import UniversalComponent from '@/components/ui/UniversalComponent'
import DateRange from '@/components/DateRange'
import { useApi } from '@/utils/services/axios'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { OrderArrayType } from '@/utils/types/order.types'

interface FacilityUnit {
    id: number
    facilityUnit: string
}

const MixersPage = () => {
    const { getURLs, getParam, setParam } = useURLParameters()

    const { data: facilityUnits } = useApi<FacilityUnit[] | undefined>(`mixers`)
    const { data: salesData } = useApi<OrderArrayType[]>(`sales?${getURLs().toString()}`)

    return (
        <UniversalComponent>
            <Box width='100%' height='94%' p={5} mt={1}>
                <Box marginBottom='34px' height='5%' display='flex' justifyContent='space-between'>
                    <Box display='flex' gap='15px' width='100%'>
                        <DateRange />
                        <Select
                            width='15%'
                            size='sm'
                            borderRadius={5}
                            placeholder='Цех'
                            name='bakingFacilityUnitId'
                            defaultValue={getParam('facilityUnitId')}
                            onChange={(e) => setParam('facilityUnitId', e.target.value)}
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
                    {salesData && <TableData data={salesData?.filter((sale) => sale.done === 1)} />}
                </Box>
            </Box>
        </UniversalComponent>
    )
}

export default MixersPage
