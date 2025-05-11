import { ReactNode, createContext } from 'react'
import { useToast } from '@chakra-ui/react'

type ToastContextType = {
    success: (message: string) => void
    error: (message: string) => void
    loading: (promise: Promise<{ message: string }>) => void
}

export const ToastContext = createContext<ToastContextType | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const toast = useToast()

    const success = (message: string) => {
        toast({
            title: 'Успешно',
            description: message,
            status: 'success',
            duration: 3000,
            isClosable: true,
        })
    }

    const error = (message: string) => {
        toast({
            title: 'Ошибка',
            description: message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        })
    }

    const loading = (promise: Promise<{ message: string }>) => {
        toast({
            title: 'Загрузка',
            description: 'Пожалуйста подождите',
            status: 'info',
            duration: null,
            isClosable: true,
        })

        promise
            .then((response) => {
                toast.closeAll()
                toast({
                    title: 'Успешно!',
                    description: response.message,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                })
            })
            .catch((error) => {
                toast.closeAll()
                toast({
                    title: 'Что-то пошло не так',
                    description: error.response.data.message || 'Ошибка',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
            })
    }

    return (
        <ToastContext.Provider value={{ success, error, loading }}>
            {children}
        </ToastContext.Provider>
    )
}
