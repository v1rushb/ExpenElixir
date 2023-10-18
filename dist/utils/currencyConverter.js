export const currencyConverterFromUSDtoOther = async (amount, currencyType) => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json();
    return currency.data[currencyType] * amount;
};
export const currencyConverterFromOtherToUSD = async (amount, currencyType) => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json();
    return amount / currency.data[currencyType];
};
//# sourceMappingURL=currencyConverter.js.map