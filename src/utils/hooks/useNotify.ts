import { useContext } from 'react'
import { ToastContext } from '../providers/ToastProvider'

export const useNotify = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useNotify must be used within a ToastProvider')
    }
    return context
}
