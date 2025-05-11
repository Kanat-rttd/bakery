import Loading from '@/components/Loading'
import { NOTFOUND_ROUTE } from '@/utils/constants/routes.consts'
import { Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Products from './modules/Products'
import Debt from './modules/Debt'

type PageType = 'products' | 'debt'

const PurchasePage = () => {
    const [content, setContent] = useState<JSX.Element | null>(null)
    const { page } = useParams<{ page: PageType }>()
    const navigate = useNavigate()

    const pagesMap: { [key in PageType]: JSX.Element } = {
        products: <Products />,
        debt: <Debt />,
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

export default PurchasePage
