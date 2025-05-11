export type DepartPersonalType = {
    id: number
    name: string
    surname: string
    status: string
    userClass: string
    fixSalary: string
    bakingFacilityUnitId: number
    bakingFacilityUnit: {
        id: number
        facilityUnit: string
    }
}
