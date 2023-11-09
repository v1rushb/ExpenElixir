import express from 'express';
import dataSource from "../db/dataSource.js";
import { Income } from "../db/entities/Income.js";
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';
import { CustomError } from '../CustomError.js';
import { currencyConverterFromOtherToUSD, incomeOnProfileCurrency } from '../utils/currencyConverter.js';
import { EqualOperator, In } from 'typeorm';


const insertIncome = async (payload: Gen.insertIncome, res: express.Response) => {
    try {
        return dataSource.manager.transaction(async trans => {
            const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || "USD")
            const newIncome = Income.create({
                title: payload.title,
                amount: currency.amount,
                incomeDate: payload.incomeDate,
                description: payload.description,
                currencyData: JSON.stringify(currency.currencyData),
            });
            await trans.save(newIncome);
            const user = await Users.findOne({
                where: { id: res.locals.user.id },
                relations: ["incomes"],
            });
            if (!user) {
                throw new Error("Session terminated. You have to log in again!");
            }
            user.incomes.push(newIncome);
            await trans.save(user);
        });
    }
    catch (err) {
        throw new CustomError(`An error occurred while trying to add a new income. try again later!`, 500);
    }
}

const deleteAllIncomes = async (res: express.Response): Promise<void> => {
    await Income.delete({ user: new EqualOperator(res.locals.user.id) });
}

const deleteIncome = async (payload: Gen.deleteIncome, res: express.Response): Promise<string> => {
    if (!payload.id)
        throw new CustomError("ID is required.", 400);
    try {
        const income = await Income.findOne({ where: { id: payload.id } });
        if (!income)
            throw new CustomError(`Income with id: ${payload.id} was not found!`, 404);
        await Income.remove(income);
        return income.title;
    } catch (err) {
        throw new CustomError(`${err}`, 500);
    }
}

const totalIncomes = async (res: express.Response): Promise<number> => {

    const incomes = await Income.find({
        where: { user: new EqualOperator(res.locals.user.id) }
    });
    const results = await incomeOnProfileCurrency(incomes, res.locals.user)
    const total = results ? results.reduce((acc, income) => acc + income.amount, 0) : 0

    return total
}

const modifyIncome = async (payload: Gen.modifyIncome, res: express.Response): Promise<string> => {
    const userIncomes: Income[] = res.locals.user.incomes;
    if (!payload.id)
        throw new CustomError("ID is required.", 400);
    try {
        const income = userIncomes.find(income => income.id === payload.id);
        if (!income)
            throw new CustomError(`Income with id: ${payload.id} was not found!`, 404);
        const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || "USD")
        income.title = payload.title;
        income.amount = currency.amount;
        income.incomeDate = payload.incomeDate;
        income.description = payload.description;

        await income.save();
    } catch (err) {
        throw new CustomError(`${err}`, 500);
    }
    return res.locals.user.username;
}
const getIncome = async (req: express.Request, res: express.Response): Promise<Income[]> => {
    try {
        const filter = {
            ...res.locals.filter,
            where: { user: new EqualOperator(res.locals.user.id) },
            select: { id: true, title: true, amount: true, incomeDate: true, description: true, currencyData: false }
        }

        const incomes = await Income.find(filter)
        const results = await incomeOnProfileCurrency(incomes, res.locals.user)

        return results as unknown as Promise<Income[]>;

    } catch (err: unknown) {
        if (err instanceof CustomError) {
            throw new CustomError(err.message, err.statusCode);
        }
        throw new CustomError(`Internal Server Error`, 500);
    }
};
export {
    insertIncome,
    deleteAllIncomes,
    deleteIncome,
    totalIncomes,
    modifyIncome,
    getIncome,
}