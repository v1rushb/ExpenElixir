import express from 'express';
import dataSource from "../db/dataSource.js";
import { Expense } from "../db/entities/Expense.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';
import { Category } from '../db/entities/Category.js';

const insertExpense = async (payload: Gen.Expense, req: express.Request) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async trans => {

            const newExpense = Expense.create({
                title: payload.title,
                amount: Number(payload.amount),
                expenseDate: payload.expenseDate,
                description: payload.description,
                picURL: payload.picURL
            });
            await trans.save(newExpense);
            console.log(decode?.id);
            const user = await Users.findOne({
                where: { id: decode?.id },
                relations: ["expenses"],
            });
            if (!user) {
                throw ("User not found."); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
            const category = await Category.findOne({
                where: { id: payload.category },
                relations: ["expenses"],
            });
            if (!category) {
                throw ("Category not found."); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
            user.expenses.push(newExpense);
            category.expenses.push(newExpense);
            await trans.save(user);
            await trans.save(category);
        });
    }
    catch (err) {
        throw (err);
    }
}

const deleteAllExpenses = async (req: express.Request) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async trans => {
            const user = await Users.findOneOrFail({
                where: { id: decode?.id },
                relations: ["expenses"],
            });

            await Expense.delete({ users: user.id });
        });
    }
    catch (err) {
        throw (err);
    }
}

const deleteExpense = async (id: string) => {
    try {
        const expense = await Expense.findOne({ where: { id } });
        if (!expense)
            throw (`Expense with id: ${id} was not found!`);
        await Expense.remove(expense);
    } catch (err) {
        throw (`An error occurred while trying to delete the expense. ${err}`);
    }
}

const totalExpenses = async (req: express.Request) => {
    const decode = jwt.decode(req.cookies["token"], { json: true });
    console.log(decode?.id);

    const user = await Users.findOne({
        where: { id: decode?.id }
    });
    const expenseList = user?.expenses
    const total = expenseList ? expenseList.reduce((acc, expense) => acc + expense.amount, 0) : 0
    return total
}

export {
    insertExpense,
    deleteAllExpenses,
    deleteExpense,
    totalExpenses
}