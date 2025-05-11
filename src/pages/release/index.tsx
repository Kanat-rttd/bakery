import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, Suspense, lazy } from 'react'
import { NOTFOUND_ROUTE } from '../../utils/constants/routes.consts'
import Loading from '../../components/Loading'

const Distribution = lazy(() => import('./modules/Distribution'))
const Refund = lazy(() => import('./modules/Refund'))

type PageType = 'user' | 'score' | 'distribution' | 'refund'

const ReleasePage = () => {
    const [content, setContent] = useState<JSX.Element | null>(null)
    const { page } = useParams<{ page: PageType }>()
    const navigate = useNavigate()

    const pagesMap: { [key in PageType]: JSX.Element } = {
        user: <div />,
        score: <input />,
        distribution: <Distribution />,
        refund: <Refund />,
    }

    useEffect(() => {
        if (page && pagesMap[page]) {
            setContent(pagesMap[page])
        } else {
            navigate(NOTFOUND_ROUTE)
        }
    }, [page, navigate])

    return <Suspense fallback={<Loading />}>{content}</Suspense>
}

export default ReleasePage
