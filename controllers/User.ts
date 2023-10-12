import express from 'express';
import dataSource from "../db/dataSource.js";
import { Users } from "../db/entities/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Gen } from '../@types/generic.js';
import { totalIncomes } from './Income.js';
import { totalExpenses } from './Expense.js';
import { CustomError } from '../CustomError.js';

const insertUser = async (payload: Gen.User) => {
    try {
        return await dataSource.transaction(async trans => {
            const newUser = Users.create({
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                username: payload.username,
                password: payload.password,
                phoneNumber: payload.phoneNumber,
            });
            return await trans.save(newUser);
        });
    } catch (err: any) {
        if (err.code.includes('ER_DUP_ENTRY')) {
            throw new CustomError(`User with email: ${payload.email} already exists.`, 409);
        }
        throw new CustomError(`Internal Server Error`, 500);
    }
};

const login = async (email: string, password: string) => {
    try {
        const info = await Users.findOne({
            where: { email: email }
        });
        if (info) {
            const passMatch = await bcrypt.compare(password, info.password || '');
            if (passMatch) {
                const token = jwt.sign({
                    email: info.email,
                    username: info.username,
                    id: info.id,
                },
                    process.env.SECRET_KEY || '',
                    {
                        expiresIn: '30m'
                    })
                return { username: info.username, email: email, token };
            }
            else {
                throw new CustomError(`Invalid password`, 401)
            }
        }
        else {
            throw new CustomError(`Invalid email.` ,400);
        }

    } catch(err) {
        if(err instanceof CustomError)
            throw(err);
        throw new CustomError(`An error occurred while trying to log you in. Error: ${err}`, 500);
    }
}

const calculateBalance = async (req: express.Request) => {
    try {
        return `Your account Balance : ${await totalIncomes(req) - await totalExpenses(req)}`
    }
    catch (err) {
        throw new CustomError(`Unexpected Error ${err}`,500);
    }
}


export {
    insertUser,
    login,
    calculateBalance,
}