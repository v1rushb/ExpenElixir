import { Gen } from "../@types/generic.js";



export const currencyConverterFromUSDtoOther = async (amount: number, currencyType: string, data: Gen.currencyType | any): Promise<number> => {

    return amount * data[currencyType]
}


export const currencyConverterFromOtherToUSD = async (amount: number, currencyType: string): Promise<{ amount: number, currencyData: object }> => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json()
    console.log(currency.data);

    return { amount: amount / currency.data[currencyType], currencyData: currency.data }
}
