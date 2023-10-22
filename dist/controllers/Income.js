import dataSource from "../db/dataSource.js";
import { Income } from "../db/entities/Income.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';
import { currencyConverterFromOtherToUSD } from '../utils/currencyConverter.js';
const decodeToken = (req) => {
    const token = req.cookies["token"];
    const decode = jwt.decode(token, { json: true });
    if (!decode)
        throw new CustomError(`Invalid Error`, 401);
    return decode;
};
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
const deleteAllIncomes = async (req) => {
    try {
        const decode = decodeToken(req);
        return dataSource.manager.transaction(async (trans) => {
            const user = await Users.findOneOrFail({
                where: { id: decode?.id },
                relations: ["incomes"],
            });
            await Income.delete({ user: user.id });
        });
    }
    catch (err) {
        if (err.name.includes(`EntityNotFound`))
            throw new CustomError("Session Terminated, Log in again.", 404);
        throw new CustomError(`You have no incomes to delete!`, 404);
    }
};
const deleteIncome = async (id, req) => {
    const decode = decodeToken(req);
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
    return decode.username;
};
const totalIncomes = async (req) => {
    const decode = decodeToken(req);
    const user = await Users.findOne({
        where: { id: decode?.id }
    });
    const incomeList = user?.incomes;
    const total = incomeList ? incomeList.reduce((acc, income) => acc + income.amount, 0) : 0;
    return total;
};
export { insertIncome, deleteAllIncomes, deleteIncome, totalIncomes, decodeToken, };
//# sourceMappingURL=Income.js.map