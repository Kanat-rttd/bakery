import { Th } from '@chakra-ui/react'
import React from 'react'

interface RevertThProps {
    text: string
}

const verticalTh: React.CSSProperties = {
    writingMode: 'vertical-lr',
    transform: 'rotate(180deg)',
}

const RevertTh: React.FC<RevertThProps> = ({ text }) => {
    return (
        <Th p={0} textAlign='center'>
            <span style={verticalTh}>{text}</span>
        </Th>
    )
}

export default RevertTh
