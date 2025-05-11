import React, { ReactNode, CSSProperties } from 'react'
import { Box } from '@chakra-ui/react'

interface UniversalComponentProps {
    children: ReactNode
    className?: string
    style?: CSSProperties
}

const UniversalComponent: React.FC<UniversalComponentProps> = ({
    children,
    className = '',
    style = {},
}) => {
    return (
        <Box
            className={`universal-component ${className}`}
            style={{ ...style, maxWidth: '100vw', maxHeight: '100vh', height: '100vh' }}
        >
            {children}
        </Box>
    )
}

export default UniversalComponent
