import { Select } from '@chakra-ui/react'
import { forwardRef, LegacyRef } from 'react'

/**
 * Status select
 */
const StatusSelect = forwardRef((props, ref: LegacyRef<HTMLSelectElement>) => {
    return (
        <Select ref={ref} name='status' {...props}>
            <option value='1'>Активный</option>
            <option value='0'>Неактивный</option>
        </Select>
    )
})

export default StatusSelect
