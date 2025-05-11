String.prototype.formattedPhone = function () {
    if (this.length !== 10) {
        throw Error('Phone number must be 10 length')
    }
    const value = this.replace(/^\+|^8/, '')
    return `+7 (${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 8)}-${value.slice(8)}`
}

export {}
