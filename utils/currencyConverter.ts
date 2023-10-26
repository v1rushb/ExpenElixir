import { Gen } from "../@types/generic.js";
import { Expense } from "../db/entities/Expense.js";



export const currencyConverterFromUSDtoOther = async (amount: number, currencyType: string, data: Gen.currencyType | any): Promise<number> => {
    const JsonData = await JSON.parse(data);



    return amount * JsonData[currencyType]
}


export const currencyConverterFromOtherToUSD = async (amount: number, currencyType: string): Promise<{ amount: number, currencyData: object }> => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json()
    console.log(currency.data);

    return { amount: amount / currency.data[currencyType], currencyData: currency.data }
}

export const expenseOnProfileCurrency = async (expenses: Expense[], profileCurrency: string) => {
    return await Promise.all(
        expenses.map(async (expense) => {
            const amount = await currencyConverterFromUSDtoOther(expense.amount, profileCurrency, expense.data);
            return { ...expense, amount };
        })
    )
};
