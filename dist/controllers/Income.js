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
<<<<<<< HEAD
const modifyIncome = async (id, payload, res) => {
    const userIncomes = res.locals.user.incomes;
    if (!id)
        throw new CustomError("ID is required.", 400);
    try {
        const income = userIncomes.find(income => income.id === id);
        if (!income)
            throw new CustomError(`Income with id: ${id} was not found!`, 404);
        const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || "USD");
        income.title = payload.title;
        income.amount = currency.amount;
        income.incomeDate = payload.incomeDate;
        income.description = payload.description;
        await income.save();
    }
    catch (err) {
        throw new CustomError(`${err}`, 500);
    }
    return res.locals.user.username;
};
export { insertIncome, deleteAllIncomes, deleteIncome, totalIncomes, decodeToken, modifyIncome, };
=======
export { insertIncome, deleteAllIncomes, deleteIncome, totalIncomes, };
>>>>>>> cb0ba2cd9df643339156b91aebbf2ed32f3b63cd
//# sourceMappingURL=Income.js.map