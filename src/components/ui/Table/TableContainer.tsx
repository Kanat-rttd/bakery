import React from 'react'
import { TableContainer, TableContainerProps, Spinner, Box } from '@chakra-ui/react'
import classes from '../styles.module.css'

interface StyledTableContainerProps extends TableContainerProps {
    isLoading?: boolean
    children?: React.ReactNode
    style?: React.CSSProperties
}

const StyledTableContainer: React.FC<StyledTableContainerProps> = ({
    children,
    isLoading,
    style,
    ...props
}) => {
    return (
        <Box className={classes.tableWrapper}>
            <TableContainer className={classes.tableContainer} style={style} {...props}>
                {isLoading ? (
                    <div className={classes.spinnerOverlay}>
                        <Spinner size='lg' color='blue.500' />
                    </div>
                ) : (
                    children
                )}
            </TableContainer>
        </Box>
    )
}

export default StyledTableContainer
