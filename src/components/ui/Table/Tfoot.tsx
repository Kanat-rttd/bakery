import { Tfoot, TableFooterProps } from '@chakra-ui/react'
import classes from '../styles.module.css'
interface StyledTfootProps extends TableFooterProps {
    children?: React.ReactNode
}

const StyledTfoot: React.FC<StyledTfootProps> = ({ children, ...props }) => {
    return (
        <Tfoot className={classes.tfoot} {...props}>
            {children}
        </Tfoot>
    )
}

export default StyledTfoot
