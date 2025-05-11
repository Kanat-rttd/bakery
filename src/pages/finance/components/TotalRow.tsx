import { Box, Icon, Text, Tooltip } from '@chakra-ui/react'
import { QuestionIcon } from '@chakra-ui/icons'

const TotalRow = ({
    label,
    description,
    value,
}: {
    label: string
    description?: string
    value: number | undefined
}) => (
    <Box display='flex' flexDirection='row' justifyContent='space-between' fontSize={20}>
        <Box display='flex' alignItems='center' gap='10px'>
            <Text color='var(--deep-blue)' fontWeight={600} fontSize={20}>
                {label}
            </Text>
            {description && (
                <Tooltip label={description} aria-label='description'>
                    <Icon fontSize='14px' as={QuestionIcon} />
                </Tooltip>
            )}
        </Box>
        <Text color={value && Number(value) < 0 ? 'red' : Number(value) === 0 ? 'black' : 'green'}>
            {value && value.toLocaleString()}
        </Text>
    </Box>
)

export default TotalRow
