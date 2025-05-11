import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { NOTFOUND_ROUTE } from '../../utils/constants/routes.consts'
import Loading from '../../components/Loading'

const Pastry = lazy(() => import('./modules/Pastry'))
const BakingProducts = lazy(() => import('./modules/BakingProducts'))
const RemainRawMaterials = lazy(() => import('./modules/RemainRawMaterials'))
const RemainProducts = lazy(() => import('./modules/RemainProducts'))
const ShiftAccounting = lazy(() => import('./modules/ShiftAccounting'))

type PageType =
    | 'user'
    | 'score'
    | 'bakingProducts'
    | 'pastry'
    | 'remainRawMaterials'
    | 'remainProducts'
    | 'shiftAccounting'

const MixersPage = () => {
    const [content, setContent] = useState<JSX.Element | null>(null)
    const { page } = useParams<{ page: PageType }>()
    const navigate = useNavigate()

    const pagesMap: { [key in PageType]: JSX.Element } = {
        user: <div />,
        score: <input />,
        bakingProducts: <BakingProducts />,
        pastry: <Pastry />,
        remainRawMaterials: <RemainRawMaterials />,
        remainProducts: <RemainProducts />,
        shiftAccounting: <ShiftAccounting />,
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

export default MixersPage
