export type ShiftAccountingType = {
    id: number
    date: Date
    bakingFacilityUnitId: number
    shiftAccountingDetails: [
        {
            id: number
            shiftAccountingId: number
            departPersonalId: number
            shiftTime: number
            departPersonal: {
                id: number
                name: string
            }
        },
    ]
    bakingFacilityUnit: {
        id: number
        facilityUnit: string
    }
}
