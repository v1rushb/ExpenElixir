import { EqualOperator } from "typeorm";
import { Gen } from "../@types/generic.js";
import { Expense } from "../db/entities/Expense.js";
import { Users } from "../db/entities/Users.js";
import { Income } from "../db/entities/Income.js";



export const currencyConverterFromUSDtoOther = async (amount: number, currencyType: string, data: Gen.currencyType | any): Promise<number> => {
    const JsonData = await JSON.parse(data);
    return amount * JsonData[currencyType]
}


export const currencyConverterFromOtherToUSD = async (amount: number, currencyType: string): Promise<{ amount: number, currencyData: object }> => {
    const currency = await (await fetch(`https://api.freecurrencyapi.com/v1/latest?apikey=${process.env.FREE_CURRENCY_API}`, { method: 'GET' })).json()
    console.log(currency.currencyData);

    return { amount: amount / currency.data[currencyType], currencyData: currency.data }
}

export const expenseOnProfileCurrency = async (expenses: Expense[], user: Users) => {

    return await Promise.all(
        expenses.map(async (expense) => {
            const expen = await Expense.findOne({ where: { id: expense.id } })
            const amount = await currencyConverterFromUSDtoOther(expense.amount, user?.profile?.Currency as string, expen?.currencyData);
            return { ...expense, currency: user?.profile?.Currency, amount };
        })
    )
};
export const incomeOnProfileCurrency = async (incomes: Income[], user: Users) => {

    return await Promise.all(
        incomes.map(async (income) => {
            const inc = await Income.findOne({ where: { id: income.id } })
            const amount = await currencyConverterFromUSDtoOther(income.amount, user?.profile?.Currency as string, inc?.currencyData);
            return { ...income, currency: user?.profile?.Currency, amount };
        })
    )
};

