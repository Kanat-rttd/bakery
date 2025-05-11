import { Accordion, Box } from '@chakra-ui/react'
import DateRange from '../../../components/DateRange'
import { useURLParameters } from '@/utils/hooks/useURLParameters'
import { useApi } from '@/utils/services/axios'
import IsMobile from '@/utils/helpers/isMobile.ts'
import TotalRow from '@/pages/finance/components/TotalRow.tsx'
import Row from '@/pages/finance/components/Row.tsx'

interface Report {
    initial: number
    operational: {
        total: number
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
    financial: {
        total: number
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
    balance: number
    final: number
    total: number
}

const Report = () => {
    const { getURLs } = useURLParameters()

    const { data: financeData } = useApi<Report>(`finance/report?${getURLs().toString()}`)

    const initial = financeData?.initial
    const operational = financeData?.operational
    const financial = financeData?.financial
    const total = financeData?.total

    return (
        <Box display='flex' flexDirection='column' gap='1rem' padding={IsMobile() ? 0 : 5}>
            <Box width='55%' display='flex' gap='10px'>
                <DateRange />
            </Box>
            <Box w='100%' display='flex' justifyContent='center'>
                <Accordion
                    allowMultiple
                    display='flex'
                    width='100%'
                    flexDirection='column'
                    gap='5px'
                    overflow='auto'
                    borderRadius='5px'
                    boxShadow='rgba(0, 0, 0, 0.24) 0px 3px 8px'
                    padding='1rem'
                >
                    <TotalRow
                        label='ОСТАТОК НА НАЧАЛО'
                        description='Это сумма, которая была на счету компании на начало отчетного периода. Начальный остаток средств.'
                        value={initial ?? 0}
                    />
                    <Row
                        label='Движение средств от операционной деятельности'
                        description='Поступления или оттоки денежных средств, связанные с основной деятельностью компании, такой как продажа продуктов, выплаты заработной платы и т.д.'
                        value={operational?.total ?? 0}
                        items={operational?.items ?? []}
                    />
                    <Row
                        label='Движение средств от финансовой деятельности'
                        description='Денежные потоки, связанные с привлечением или возвратом финансовых средств, например, кредиты, выплаты процентов по займам или инвестирования.'
                        value={financial?.total ?? 0}
                        items={financial?.items ?? []}
                    />
                    {/*<Row label='Баланс переводов' value={balance ?? 0} />*/}
                    <TotalRow
                        label='ОСТАТОК НА КОНЕЦ'
                        description='Это итоговая сумма денежных средств на конец отчетного периода после учета всех операций.'
                        value={total ?? 0}
                    />
                </Accordion>
            </Box>
        </Box>
    )
}

export default Report
