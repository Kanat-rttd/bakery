import {
    AccordionButton,
    AccordionItem,
    AccordionPanel,
    Box,
    Icon,
    List,
    ListItem,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { QuestionIcon } from '@chakra-ui/icons'

interface RowProps {
    label: string
    description: string
    value: number
    items: {
        amount: number
        comment: ''
        date: Date
        financeCategory: {
            id: number
            name: string
            type: string
        }
    }[]
}

const Row = ({ label, description, value, items }: RowProps) => {
    return (
        <AccordionItem paddingLeft='20px'>
            <AccordionButton display='flex' justifyContent='space-between' px={0}>
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
                <Text color={value < 0 ? 'red' : value === 0 ? 'black' : 'green'} fontSize={20}>
                    {value && value.toLocaleString()}
                </Text>
            </AccordionButton>

            <AccordionPanel>
                {items.length ? (
                    <List width='100%'>
                        {items.map((item, index) => (
                            <ListItem key={index} display='flex' justifyContent='space-between'>
                                <Text>{item.financeCategory?.name}</Text>
                                <Text
                                    color={
                                        item.amount < 0
                                            ? 'red'
                                            : item.amount === 0
                                              ? 'black'
                                              : 'green'
                                    }
                                >
                                    {item.amount}
                                </Text>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Text justifySelf='center'>Нет данных</Text>
                )}
            </AccordionPanel>
        </AccordionItem>
    )
}
export default Row
