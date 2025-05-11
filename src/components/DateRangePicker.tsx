import { useState } from 'react'
import {
    Box,
    Flex,
    Text,
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    Button,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'

const DateRangePicker = () => {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const handleApply = () => {
        setIsOpen(false)
    }

    const handleClear = () => {
        setStartDate('')
        setEndDate('')
    }

    return (
        <Box border='1px solid #E2E8F0' borderRadius='8px' paddingRight='10px'>
            <Flex align='center'>
                <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <PopoverTrigger>
                        <IconButton
                            aria-label='Open Date Range Picker'
                            icon={<CalendarIcon />}
                            mr={2}
                            onClick={() => setIsOpen(!isOpen)}
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverHeader>Выберите диапазон дат</PopoverHeader>
                        <PopoverBody>
                            <Flex direction='column' align='center'>
                                <input
                                    type='date'
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <Text mt={2}>-</Text>
                                <input
                                    type='date'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Flex>
                            <Flex justify='center' mt={4}>
                                <Button onClick={handleClear}>Очистить</Button>
                                <Button colorScheme='blue' ml={2} onClick={handleApply}>
                                    Применить
                                </Button>
                            </Flex>
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
                <Text>
                    {startDate ? startDate : 'None'} - {endDate ? endDate : 'None'}
                </Text>
            </Flex>
        </Box>
    )
}

export default DateRangePicker
