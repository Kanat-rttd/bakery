import DateRange from '@/components/DateRange'
import { TableContainer, Tfoot, Thead } from '@/components/ui'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import { DepartPersonalType } from '@/utils/types/departPersonal.types'
import { FacilityUnit } from '@/utils/types/product.types'
import { ShiftAccountingType } from '@/utils/types/shiftAccounting.types'
import { Box, Select, Table, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { forwardRef, useImperativeHandle } from 'react'
import { generateExcel } from '@/utils/services/spreadsheet.service.ts'
import { useNotify } from '@/utils/hooks/useNotify.ts'

interface PivotTableProps {
    shiftAccounting: ShiftAccountingType[] | undefined
}

const PivotTable = forwardRef(({ shiftAccounting }: PivotTableProps, ref) => {
    const { getParam, setParam } = useURLParameters()
    const { error } = useNotify()
    const { data: departPersonalData } = useApi<DepartPersonalType[]>('departPersonal')
    const { data: facilityUnits } = useApi<FacilityUnit[] | undefined>(`mixers`)

    const uniqPersonal = new Set<string>()
    shiftAccounting?.forEach((shift) => {
        shift.shiftAccountingDetails.forEach((detail) => {
            uniqPersonal.add(detail.departPersonal.name)
        })
    })

    const getColumnTotal = (productName: string) => {
        return shiftAccounting?.reduce((total, item) => {
            const product = item.shiftAccountingDetails.find(
                (product) => product.departPersonal.name === productName,
            )
            return total + (Number(product?.shiftTime) || 0)
        }, 0)
    }

    useImperativeHandle(ref, () => ({
        async export() {
            if (!shiftAccounting || shiftAccounting.length === 0) {
                return error('Нет данных для экспорта')
            }

            const headers = ['№', 'Дата', ...Array.from(uniqPersonal)]

            const formatted = shiftAccounting.map((item, idx) => {
                const numbers = Array.from(uniqPersonal).map(
                    (name) =>
                        item.shiftAccountingDetails.find(
                            (prod) => prod.departPersonal.name === name,
                        )?.shiftTime || 0,
                )

                return [idx + 1, new Date(item.date).toLocaleDateString(), ...numbers]
            })

            const startDate = new Date(getParam('startDate')).toLocaleDateString()
            const endDate = new Date(getParam('endDate')).toLocaleDateString()

            await generateExcel(`Учет смен c ${startDate} по ${endDate}`, [
                headers,
                ...formatted,
                ['', 'ИТОГО', ...Array.from(uniqPersonal).map((name) => getColumnTotal(name))],
            ])
        },
    }))

    return (
        <Box width='100%'>
            <Box display='flex' justifyContent='space-between' mt={-3} mb={2}>
                <Box display='flex' gap='15px' mb='5px'>
                    <DateRange />
                    <Select
                        className='print-hidden'
                        size='sm'
                        borderRadius={4}
                        placeholder='Сотрудники'
                        value={getParam('personal')}
                        onChange={(event) => setParam('personal', event.target.value)}
                        width='fit-content'
                    >
                        {departPersonalData?.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                    <Select
                        className='print-hidden'
                        size='sm'
                        borderRadius={5}
                        placeholder='Цех'
                        width='fit-content'
                        defaultValue={getParam('facilityUnit')}
                        onChange={(e) => setParam('facilityUnit', e.target.value)}
                    >
                        {facilityUnits?.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.facilityUnit}
                            </option>
                        ))}
                    </Select>
                </Box>
            </Box>
            <TableContainer style={{ width: '100%', overflowY: 'auto' }}>
                <Table variant='simple'>
                    <Thead>
                        <Tr>
                            <Th w='5%'>№</Th>
                            <Th w='20%'>дата</Th>
                            {Array.from(uniqPersonal).map((name, index) => (
                                <Th textAlign='center' key={index}>
                                    {name}
                                </Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {shiftAccounting?.length ? (
                            shiftAccounting?.map((item, index) => (
                                <Tr key={index}>
                                    <Td>{index + 1}</Td>
                                    <Td>{dayjs(item.date).format('DD.MM.YYYY')}</Td>
                                    {Array.from(uniqPersonal).map((productName, productIndex) => (
                                        <Td textAlign='center' key={productIndex}>
                                            {item.shiftAccountingDetails.find(
                                                (prod) => prod.departPersonal.name === productName,
                                            )?.shiftTime || 0}
                                        </Td>
                                    ))}
                                </Tr>
                            ))
                        ) : (
                            <Tr>
                                <Td>Нет данных</Td>
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th color='#000' fontSize={15} fontWeight='bold'>
                                Итого
                            </Th>
                            <Th></Th>
                            {Array.from(uniqPersonal).map((productName, productIndex) => (
                                <Th
                                    fontSize={15}
                                    color='#000'
                                    key={productIndex}
                                    textAlign='center'
                                >
                                    {getColumnTotal(productName)}
                                </Th>
                            ))}
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </Box>
    )
})

export default PivotTable
