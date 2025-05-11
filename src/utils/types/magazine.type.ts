export type MagazineType = {
    id: number
    name: string
    clientId: number
    status: string
    client: Client
}

export type Client = {
    id: number
    name: string
}
