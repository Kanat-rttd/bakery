import { createStaticRanges } from 'react-date-range'
import dayjs from 'dayjs'

const today = dayjs()
const endOfToday = today.endOf('day')

export const staticRanges = createStaticRanges([
    {
        label: 'За сегодня',
        range: () => ({
            startDate: today.toDate(),
            endDate: endOfToday.toDate(),
        }),
    },
    {
        label: 'За неделю',
        range: () => ({
            startDate: today.subtract(1, 'week').toDate(),
            endDate: endOfToday.toDate(),
        }),
    },
    {
        label: 'За месяц',
        range: () => ({
            startDate: today.subtract(1, 'month').toDate(),
            endDate: endOfToday.toDate(),
        }),
    },
    {
        label: 'За три месяца',
        range: () => ({
            startDate: today.subtract(3, 'month').toDate(),
            endDate: endOfToday.toDate(),
        }),
    },
    {
        label: 'За полгода',
        range: () => ({
            startDate: today.subtract(6, 'month').toDate(),
            endDate: endOfToday.toDate(),
        }),
    },
    {
        label: 'За 1 год',
        range: () => ({
            startDate: today.subtract(1, 'year').toDate(),
            endDate: endOfToday.toDate(),
        }),
    },
])
