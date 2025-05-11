import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

/**
 * Кастомный хук для работы с параметрами URL с использованием react-router-dom v6
 * @returns Объект с методами для работы с параметрами URL
 */
export function useURLParameters() {
    const [searchParams, setSearchParams] = useSearchParams()

    const getParam = (param: string) => {
        return searchParams.get(param) ?? ''
    }

    const getURLs = () => {
        return searchParams.toString()
    }

    const setParam = (param: string, value: string, replace: boolean = true) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete(param)
        if (value) {
            newParams.set(param, value)
        }

        setSearchParams(newParams, { replace })
    }

    const getAllParams = useMemo(() => {
        const params: { [key: string]: string | undefined } = {}
        for (const [key, value] of searchParams) {
            params[key] = value
        }
        return params
    }, [searchParams])

    const setParamObject = (paramsObject: { [key: string]: string | undefined }) => {
        const newParams = new URLSearchParams(searchParams)

        for (const key in paramsObject) {
            const value = paramsObject[key]
            if (value) {
                newParams.set(key, value)
            } else {
                newParams.delete(key)
            }
        }

        setSearchParams(newParams, { replace: true })
    }

    return { getParam, setParam, getAllParams, setParamObject, getURLs }
}
