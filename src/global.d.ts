declare global {
    interface Number {
        formatted(): string
    }

    interface String {
        formattedPhone(): string
    }
}

export {}
