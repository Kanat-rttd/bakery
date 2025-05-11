export type User = {
    id: number
    name: string
    surname: string
    status: string
    pass: string
    checkPass: string
    phone: string
    userClass: string
    permission: { label: string }[]
    fixSalary: string
}
