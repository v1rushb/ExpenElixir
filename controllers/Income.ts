import express from 'express';
import dataSource from "../db/dataSource.js";
import { Income } from "../db/entities/Income.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';

const insertIncome = async (payload: Gen.Income, req: express.Request) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async trans => {

            const newIncome = Income.create({
                title: payload.title,
                amount: Number(payload.amount),
                incomeDate: payload.incomeDate,
                description: payload.description,
            });
            await trans.save(newIncome);
            console.log(decode?.id);
            const user = await Users.findOne({
                where: { id: decode?.id },
                relations: ["incomes"],
            });
            if (!user) {
                throw ("User not found."); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
            user.incomes.push(newIncome);
            await trans.save(user);
        });
    }
    catch (err) {
        throw (err);
    }
}

const deleteAllIncomes = async (req: express.Request) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async trans => {
            const user = await Users.findOneOrFail({
                where: { id: decode?.id },
                relations: ["incomes"],
            });

            await Income.delete({ user: user.id });
        });
    }
    catch (err) {
        throw (err);
    }
}

const deleteIncome = async (id: string) => {
    try {
        const income = await Income.findOne({ where: { id } });
        if (!income)
            throw (`Income with id: ${id} was not found!`);
        await Income.remove(income);
    } catch (err) {
        throw (`An error occurred while trying to delete the income. ${err}`);
    }
}

const totalIncomes = async (req: express.Request) => {
    const decode = jwt.decode(req.cookies["token"], { json: true });
    console.log(decode?.id);

    const user = await Users.findOne({
        where: { id: decode?.id }
    });
    const incomeList = user?.incomes
    const total = incomeList ? incomeList.reduce((acc, income) => acc + income.amount, 0) : 0

    return total
}
export {
    insertIncome,
    deleteAllIncomes,
    deleteIncome,
    totalIncomes
}