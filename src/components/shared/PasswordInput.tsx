import { useState, forwardRef, ForwardedRef } from 'react'
import { InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

/**
 * Password input with show/hide password button
 */

interface PasswordInputProps {
    placeholder: string
}

const PasswordInput = forwardRef(
    ({ placeholder, ...props }: PasswordInputProps, ref: ForwardedRef<HTMLInputElement>) => {
        const [showPassword, setShowPassword] = useState(false)
        const handlePasswordVisibility = () => setShowPassword(!showPassword)

        return (
            <InputGroup size='md'>
                <Input
                    placeholder={placeholder}
                    ref={ref}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete='new-password'
                    {...props}
                />
                <InputRightElement>
                    <IconButton
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={handlePasswordVisibility}
                        variant='ghost'
                        size='sm'
                        aria-label=''
                    />
                </InputRightElement>
            </InputGroup>
        )
    },
)

export default PasswordInput
