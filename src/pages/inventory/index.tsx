import Loading from '@/components/Loading'
import { NOTFOUND_ROUTE } from '@/utils/constants/routes.consts'
import { Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Inventory from './modules/Inventory'
import Fact from './modules/Fact'

type PageType = 'fact' | 'details'

const InventoryPage = () => {
    const [content, setContent] = useState<JSX.Element | null>(null)
    const { page } = useParams<{ page: PageType }>()
    const navigate = useNavigate()

    const pagesMap: { [key in PageType]: JSX.Element } = {
        fact: <Fact />,
        details: <Inventory />,
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

export default InventoryPage
