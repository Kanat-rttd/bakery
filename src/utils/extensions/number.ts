Number.prototype.formatted = function () {
    const formatter = new Intl.NumberFormat('ru-KZ')
    return formatter.format(Number(this))
}
export {}
