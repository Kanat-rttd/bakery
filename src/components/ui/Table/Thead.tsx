import { Thead, TableHeadProps } from '@chakra-ui/react'
import classes from '../styles.module.css'
interface StyledTheadProps extends TableHeadProps {
    children?: React.ReactNode
}

const StyledThead: React.FC<StyledTheadProps> = ({ children, ...props }) => {
    return (
        <Thead className={classes.thead} {...props}>
            {children}
        </Thead>
    )
}

export default StyledThead
