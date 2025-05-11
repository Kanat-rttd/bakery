import { Input, InputGroup } from '@chakra-ui/react'
import { ForwardedRef, forwardRef } from 'react'

/**
 * Input type number
 */

type NumberInputProps = {
    placeholder: string
}
const InputNumber = forwardRef(
    ({ placeholder, ...props }: NumberInputProps, ref: ForwardedRef<HTMLInputElement>) => {
        return (
            <InputGroup size='md'>
                <Input
                    {...props}
                    ref={ref}
                    type='number'
                    autoComplete='off'
                    placeholder={placeholder}
                    min='0'
                    step='0.01'
                    onKeyDown={(e) => {
                        if (e.key === '-') {
                            e.preventDefault()
                        }
                        if (e.key === 'e') {
                            e.preventDefault()
                        }
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                            e.preventDefault()
                        }
                    }}
                />
            </InputGroup>
        )
    },
)

export default InputNumber
