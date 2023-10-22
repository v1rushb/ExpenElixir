export const currencyConverterFromUSDtoOther = async (amount, currencyType, data) => {
    return amount * data[currencyType];
};
export const currencyConverterFromOtherToUSD = async (amount, currencyType) => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json();
    console.log(currency.data);
    return { amount: amount / currency.data[currencyType], currencyData: currency.data };
};
//# sourceMappingURL=currencyConverter.js.map