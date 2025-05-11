import { Routes, Route } from 'react-router-dom'
import { publicRoutes } from './utils/AppRouter'
import { Suspense, useEffect } from 'react'
import { LOGIN_ROUTE } from './utils/constants/routes.consts'
import { useNavigate } from 'react-router-dom'
import { auth } from './utils/services/user.service'
import Layout from './components/layout'

function App() {
    const navigate = useNavigate()

    useEffect(() => {
        auth()
            .then((res) => {
                console.log(res)
            })
            .catch(() => {
                navigate(LOGIN_ROUTE)
            })
    }, [])

    return (
        <Routes>
            {publicRoutes.map(({ path, Component, Loader }) => (
                <Route
                    key={path}
                    path={path}
                    element={
                        <Layout>
                            <Suspense fallback={<Loader />}>
                                <Component />
                            </Suspense>
                        </Layout>
                    }
                />
            ))}
            {/* <Route path="*" element={<Navigate to={NOTFOUND_ROUTE} replace />} /> */}
        </Routes>
    )
}

export default App
