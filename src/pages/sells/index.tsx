import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { NOTFOUND_ROUTE } from '../../utils/constants/routes.consts'
import Loading from '../../components/Loading'

const JournalPage = lazy(() => import('./modules/Journal'))
const Invoice = lazy(() => import('./modules/Invoice'))
const DebtAccounting = lazy(() => import('./modules/DebtAccounting'))
const DebtTransfer = lazy(() => import('./modules/DebtTransfer'))

type PageType = 'invoice' | 'debtAccounting' | 'journal' | 'debtTransfer'

const SellsPage = () => {
    const [content, setContent] = useState<JSX.Element | null>(null)
    const { page, id } = useParams<{ page: PageType; id: string }>()
    const navigate = useNavigate()

    const pagesMap: { [key in PageType]: JSX.Element } = {
        invoice: <Invoice />,
        debtAccounting: <DebtAccounting />,
        journal: <JournalPage />,
        debtTransfer: <DebtTransfer />,
    }

    useEffect(() => {
        if (page == 'journal' && id) {
            setContent(<JournalPage />)
        } else if (page && pagesMap[page]) {
            setContent(pagesMap[page])
        } else {
            navigate(NOTFOUND_ROUTE)
        }
    }, [page, navigate])

    return <Suspense fallback={<Loading />}>{content}</Suspense>
}

export default SellsPage
