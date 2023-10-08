import dataSource from "../db/dataSource.js";
import { Income } from "../db/entities/Income.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
const insertIncome = async (payload, req) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async (trans) => {
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
            if (user) { // this should always be true
                console.log(user);
                user.incomes.push(newIncome);
                await trans.save(user);
            }
            else {
                throw ("User not found."); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
        });
    }
    catch (err) {
        throw (err);
    }
};
const deleteAllIncomes = async (req) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async (trans) => {
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
};
const deleteIncome = async (id) => {
    try {
        const income = await Income.findOne({ where: { id } });
        if (!income)
            throw (`Income with id: ${id} was not found!`);
        await Income.remove(income);
    }
    catch (err) {
        throw (`An error occurred while trying to delete the income. ${err}`);
    }
};
export { insertIncome, deleteAllIncomes, deleteIncome, };
