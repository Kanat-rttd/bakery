import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'
import { ForwardedRef, forwardRef } from 'react'

/**
 * Phone input with +7 prefix
 */

type PhoneInputProps = {
    value: string
    onChange: (val: string) => void
}
const PhoneInput = forwardRef(
    ({ value, onChange }: PhoneInputProps, ref: ForwardedRef<HTMLInputElement>) => {
        return (
            <InputGroup size='md'>
                <InputLeftAddon>+7</InputLeftAddon>
                <Input
                    ref={ref}
                    type='number'
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder='707 110 10 10 *'
                    min='0'
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

export default PhoneInput
