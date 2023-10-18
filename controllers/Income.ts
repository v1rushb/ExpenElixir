import express from 'express';
import dataSource from "../db/dataSource.js";
import { Income } from "../db/entities/Income.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';
import { CustomError } from '../CustomError.js';


const decodeToken = (req: express.Request) : Gen.DecodedPayload => {
    const token = req.cookies["token"];

    const decode = jwt.decode(token, { json: true }) as Gen.DecodedPayload;

    if(!decode)
        throw new CustomError(`Invalid Error`, 401);

    return decode;
}


const insertIncome = async (payload: Gen.Income, res: express.Response) => {
    try {
        return dataSource.manager.transaction(async trans => {

            const newIncome = Income.create({
                title: payload.title,
                amount: Number(payload.amount),
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
        throw new CustomError(`An error occurred while trying to add a new income. try again later!`,500);
    }
}

const deleteAllIncomes = async (req: express.Request) => {
    try {
        const decode = decodeToken(req);
        return dataSource.manager.transaction(async trans => {
            const user = await Users.findOneOrFail({
                where: { id: decode?.id },
                relations: ["incomes"],
            });

            await Income.delete({ user: user.id });
        });
    }
    catch (err: any) {
        if(err.name.includes(`EntityNotFound`))
            throw new CustomError("Session Terminated, Log in again.", 404);

        throw new CustomError(`You have no incomes to delete!`,404);
    }
}

const deleteIncome = async (id: string, req : express.Request) : Promise<string> => {
    const decode = decodeToken(req);
    if(!id)
        throw new CustomError("ID is required.", 400);
    try {
        const income = await Income.findOne({ where: { id } });
        if (!income)
            throw new CustomError(`Income with id: ${id} was not found!`,404);
        await Income.remove(income);
    } catch (err) {
        throw new CustomError(`${err}`,500);
    }
    return decode.username;
}

const totalIncomes = async (req: express.Request) => {
    const decode = decodeToken(req);
    const user = await Users.findOne({
        where: { id: decode?.id }
    });
    const incomeList = user?.incomes
    const total = incomeList ? incomeList.reduce((acc, income) => acc + income.amount, 0) : 0

    return total
}

const addUserIncome = async (payload: Gen.Income, userID: string, res: express.Response) => {
    try {
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        return dataSource.manager.transaction(async trans => {

            const newIncome = Income.create({
                title: payload.title,
                amount: Number(payload.amount),
                incomeDate: payload.incomeDate,
                description: payload.description,
            });
            await trans.save(newIncome);
            user.incomes.push(newIncome);
            await trans.save(user);
        }); 
    } catch(err) {
        throw err;
    }
}

const deleteUserIncome = async (incomeID: string, userID: string, res: express.Response) => {
    try {
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        const income = await Income.findOne({
            where: { id: incomeID },
        });

        if (!income || income.user !== user.id) {
            throw new CustomError("Income not found.", 404);
        }

        await Income.remove(income);
    } catch(err) {
        throw err;
    }
}

const businessIncome = async (res: express.Response): Promise<any> => { // do the typing later in gen
    const users = await Users.find({ where: { business: res.locals.user.business } }) as Users[];
    const result = users.flatMap(user => user.incomes.map(income => ({ ...income, userId: user.id })));
    return result;
}

const totalBusinessIncome = async (res: express.Response): Promise<number> => { // fix error handling and typing later (for now it's any)
    const incomes = await businessIncome(res);
    return incomes ? incomes.reduce((acc: any, income: { amount: any; }) => acc + income.amount, 0) : 0
}

export {
    insertIncome,
    deleteAllIncomes,
    deleteIncome,
    totalIncomes,
    decodeToken,
    addUserIncome,
    deleteUserIncome,
    businessIncome,
    totalBusinessIncome,
}