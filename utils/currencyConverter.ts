export const currencyConverterFromUSDtoOther = async (amount: number, currencyType: string): Promise<number> => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json()
    return currency.data[currencyType] * amount;
}
export const currencyConverterFromOtherToUSD = async (amount: number, currencyType: string): Promise<number> => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json()
    return amount / currency.data[currencyType];
}
