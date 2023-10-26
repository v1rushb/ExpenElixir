import dataSource from "../db/dataSource.js";
import { Income } from "../db/entities/Income.js";
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';
import { currencyConverterFromOtherToUSD } from '../utils/currencyConverter.js';
import { EqualOperator } from 'typeorm';
const insertIncome = async (payload, res) => {
    try {
        return dataSource.manager.transaction(async (trans) => {
            const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || "USD");
            const newIncome = Income.create({
                title: payload.title,
                amount: currency.amount,
                incomeDate: payload.incomeDate,
                description: payload.description,
            });
            await trans.save(newIncome);
            const user = await Users.findOne({
                where: { id: res.locals.user.id },
                relations: ["incomes"],
            });
            if (!user) {
                throw new Error("Session terminated. You have to log in again!"); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
            user.incomes.push(newIncome);
            await trans.save(user);
        });
    }
    catch (err) {
        throw new CustomError(`An error occurred while trying to add a new income. try again later!`, 500);
    }
};
const deleteAllIncomes = async (res) => {
    await Income.delete({ user: new EqualOperator(res.locals.user.id) });
};
const deleteIncome = async (id, res) => {
    if (!id)
        throw new CustomError("ID is required.", 400);
    try {
        const income = await Income.findOne({ where: { id } });
        if (!income)
            throw new CustomError(`Income with id: ${id} was not found!`, 404);
        await Income.remove(income);
    }
    catch (err) {
        throw new CustomError(`${err}`, 500);
    }
    return res.locals.res.username;
};
const totalIncomes = async (res) => {
    const incomes = await Income.find({
        where: { user: new EqualOperator(res.locals.user.id) }
    });
    const total = incomes ? incomes.reduce((acc, income) => acc + income.amount, 0) : 0;
    return total;
};
export { insertIncome, deleteAllIncomes, deleteIncome, totalIncomes, };
//# sourceMappingURL=Income.js.map