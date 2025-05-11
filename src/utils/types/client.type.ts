export type ClientType = {
    id: string
    name: string
    surname: string
    contact: string
    telegrammId: string
    status: string
}

export type ClientsFilter = {
    contragentId: number
    contragent: {
        id: number
        contragentName: string
    }
}
