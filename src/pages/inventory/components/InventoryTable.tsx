import { Table, Tbody, Tr, Th, Td, Input } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useState } from 'react'
import { useApi } from '@/utils/services/axios'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { TableContainer, Tfoot, Thead } from '@/components/ui'

type EditInput = {
    rowId: number | null
    value: number
}

interface Inventoryzation {
    table: {
        id: 1
        category: string
        unitOfMeasure: string
        accQuantity: number
        factQuantity: number
        adjusment: number
        difference: number
    }[]
    totalRegister: number
    totalFact: number
    divergence: number
}

const InventoryTable = () => {
    const { getURLs } = useURLParameters()
    const { data: inventoryzationData } = useApi<Inventoryzation>(
        `reports/inventoryzation?${getURLs().toString()}`,
    )

    console.log(inventoryzationData)

    const [showInput, setShowInput] = useState<EditInput>()

    return (
        <>
            <TableContainer style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
                <Table variant='simple' width='100%'>
                    <Thead>
                        <Tr position='sticky' top={0} backgroundColor='white' zIndex={9}>
                            <Th>№</Th>
                            <Th>Товары</Th>
                            <Th>Единица измерения</Th>
                            <Th>Количество по учету</Th>
                            <Th>Количество фактическое</Th>
                            <Th>Расхождение</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {inventoryzationData ? (
                            inventoryzationData.table.map((item, index) => {
                                return (
                                    <Tr key={item.id}>
                                        <Td>{index + 1}</Td>
                                        <Td>{item.category}</Td>
                                        <Td>{item.unitOfMeasure}</Td>
                                        <Td>{item.accQuantity}</Td>
                                        <Td
                                            onClick={() =>
                                                setShowInput({
                                                    rowId: item.id,
                                                    value: item.factQuantity,
                                                })
                                            }
                                        >
                                            {showInput?.rowId === item.id ? (
                                                <EditInput
                                                    setShowInput={setShowInput}
                                                    showInput={showInput}
                                                />
                                            ) : (
                                                item.factQuantity
                                            )}
                                        </Td>
                                        <Td>{item.difference}</Td>
                                    </Tr>
                                )
                            })
                        ) : (
                            <Tr>
                                <Th>Нет данных</Th>
                            </Tr>
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th fontSize={15} color='#000'>
                                ИТОГО
                            </Th>
                            <Th> </Th>
                            <Th> </Th>
                            <Th fontSize={15} color='#000'>
                                {inventoryzationData?.totalRegister}
                            </Th>
                            <Th fontSize={15} color='#000'>
                                {inventoryzationData?.totalFact}
                            </Th>
                            <Th fontSize={15} color='#000'>
                                {inventoryzationData?.divergence}
                            </Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
        </>
    )
}

export default InventoryTable

type EditInputProps = {
    setShowInput: Dispatch<SetStateAction<EditInput | undefined>>
    showInput: EditInput
}

const EditInput = ({ setShowInput, showInput }: EditInputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShowInput({ rowId: showInput.rowId, value: Number(e.target.value) })
    }

    return (
        <Input
            onChange={(e) => handleChange(e)}
            value={showInput.value}
            onBlur={() => {
                setShowInput({ rowId: null, value: showInput.value })
                //fetch
            }}
            type='number'
            autoFocus
        />
    )
}
