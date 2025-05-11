import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import ru from 'date-fns/locale/ru'
import { useEffect, useMemo, useState } from 'react'
import { DateRangePicker, RangeKeyDict } from 'react-date-range'
import {
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Button,
    Text,
    Box,
    useDisclosure,
    Portal,
    PopoverArrow,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { staticRanges } from '@/utils/constants/staticRanges'

const DateRange = () => {
    const { setParamObject, getParam } = useURLParameters()
    const { isOpen, onOpen, onClose } = useDisclosure()

    let targetDate
    if (dayjs().isBefore(dayjs().startOf('day').add(14, 'hour'))) {
        targetDate = dayjs()
    } else {
        targetDate = dayjs().add(1, 'day')
    }

    const initialStartDate = dayjs(getParam('startDate')).isValid()
        ? dayjs(getParam('startDate')).toDate()
        : targetDate.toDate()

    const initialEndDate = dayjs(getParam('endDate')).isValid()
        ? dayjs(getParam('endDate')).toDate()
        : targetDate.toDate()

    const [selectionRange, setSelectionRange] = useState({
        startDate: initialStartDate,
        endDate: initialEndDate,
    })

    useEffect(() => {
        if (
            dayjs(selectionRange.startDate).format('YYYY-MM-DD') !== getParam('startDate') ||
            dayjs(selectionRange.endDate).format('YYYY-MM-DD') !== getParam('endDate')
        ) {
            setParamObject({
                startDate: dayjs(selectionRange.startDate).format('YYYY-MM-DD'),
                endDate: dayjs(selectionRange.endDate).format('YYYY-MM-DD'),
            })
        }
    }, [selectionRange])

    const handleConfirmDate = () => {
        onClose()
        setParamObject({
            startDate: dayjs(selectionRange.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(selectionRange.endDate).format('YYYY-MM-DD'),
        })
    }

    const handleCancelDate = () => {
        onClose()
    }

    const handleSelect = (ranges: RangeKeyDict) => {
        if (ranges.range1.startDate && ranges.range1.endDate) {
            setSelectionRange({
                startDate: ranges.range1.startDate,
                endDate: ranges.range1.endDate,
            })
        }
    }

    const formattedDate = useMemo(
        () =>
            `${dayjs(selectionRange.startDate).format('DD.MM.YYYY')} - ${dayjs(
                selectionRange.endDate,
            ).format('DD.MM.YYYY')}`,
        [selectionRange],
    )

    return (
        <Popover isOpen={isOpen} onClose={onClose}>
            <PopoverTrigger>
                <Box
                    onClick={onOpen}
                    maxWidth='250px'
                    backgroundColor='white'
                    cursor='pointer'
                    minWidth='fit-content'
                    display='flex'
                    alignItems='center'
                    padding='0.2rem 1.5rem'
                    height='32px'
                    borderRadius={5}
                    border='1px solid'
                    borderColor='inherit'
                    justifyContent='center'
                >
                    <Text size='sm'>{formattedDate}</Text>
                </Box>
            </PopoverTrigger>
            <Portal>
                <PopoverContent width='fit-content'>
                    <PopoverArrow />
                    <PopoverBody>
                        <DateRangePicker
                            className='dateRangePicker'
                            onChange={handleSelect}
                            ranges={[selectionRange]}
                            months={1}
                            direction='vertical'
                            showMonthAndYearPickers={false}
                            monthDisplayFormat='LLLL'
                            weekdayDisplayFormat='EEEEE'
                            locale={ru}
                            rangeColors={['#92D3D6']}
                            showDateDisplay={false}
                            editableDateInputs={false}
                            inputRanges={[]}
                            staticRanges={staticRanges}
                        />
                    </PopoverBody>
                    <Box textAlign='right' padding='5px'>
                        <Button onClick={handleConfirmDate} mr='10px'>
                            Принять
                        </Button>
                        <Button onClick={handleCancelDate}>Отмена</Button>
                    </Box>
                </PopoverContent>
            </Portal>
        </Popover>
    )
}

export default DateRange
