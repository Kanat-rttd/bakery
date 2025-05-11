import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { NOTFOUND_ROUTE } from '../../utils/constants/routes.consts'
import Loading from '../../components/Loading'

const RequestForm = lazy(() => import('./modules/RequestForm'))
const History = lazy(() => import('./modules/History'))
const OrderHistory = lazy(() => import('./modules/OrderHistory'))

type PageType = 'user' | 'history' | 'requestForm'

const SalesPage = () => {
    const [content, setContent] = useState<JSX.Element | null>(null)
    const { page, id } = useParams<{ page: PageType; id: string }>()
    const navigate = useNavigate()

    const pagesMap: { [key in PageType]: JSX.Element } = {
        user: <div />,
        history: <History />,
        requestForm: <RequestForm />,
    }

    useEffect(() => {
        if (page == 'history' && id) {
            setContent(<OrderHistory />)
        } else if (page && pagesMap[page]) {
            setContent(pagesMap[page])
        } else {
            navigate(NOTFOUND_ROUTE)
        }
    }, [page, navigate])

    return <Suspense fallback={<Loading />}>{content}</Suspense>
}

export default SalesPage
