import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import theme from './utils/helpers/theme.ts'
import { ToastProvider } from './utils/providers/ToastProvider.tsx'
import '@/utils/extensions'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ChakraProvider theme={theme}>
        <ToastProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ToastProvider>
    </ChakraProvider>,
)
