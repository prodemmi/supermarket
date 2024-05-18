export function toTomanCurrency(amount: number | string) {
    return (amount || '').toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}

export function randomBetween(min: number = 0, max: number = Infinity) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}