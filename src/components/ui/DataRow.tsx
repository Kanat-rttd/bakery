import { Td } from '@chakra-ui/react'
import React from 'react'

interface RevertThProps {
    text: string
}

const DataRow: React.FC<RevertThProps> = ({ text }) => {
    return <Td p={0}>{text}</Td>
}

export default DataRow
