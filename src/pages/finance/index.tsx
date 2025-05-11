import Loading from '@/components/Loading'
import { NOTFOUND_ROUTE } from '@/utils/constants/routes.consts'
import { Suspense, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Input from './modules/Input'
import History from './modules/History'
import Report from './modules/Report'

type PageType = 'input' | 'history' | 'report'

const FinancePage = () => {
    const [content, setContent] = useState<JSX.Element | null>(null)
    const { page } = useParams<{ page: PageType }>()
    const navigate = useNavigate()

    const pagesMap: { [key in PageType]: JSX.Element } = {
        input: <Input />,
        history: <History />,
        report: <Report />,
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

export default FinancePage
