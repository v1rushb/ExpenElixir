import dataSource from "../db/dataSource.js";
import { Users } from "../db/entities/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { totalIncomes } from './Income.js';
import { totalExpenses } from './Expense.js';
import { CustomError } from '../CustomError.js';
import { Profile } from '../db/entities/Profile.js';
const insertUser = async (payload) => {
    try {
        return await dataSource.transaction(async (trans) => {
            const newProfile = Profile.create({
                firstName: payload.firstName,
                lastName: payload.lastName,
                phoneNumber: payload.phoneNumber,
            });
            await trans.save(newProfile);
            const newUser = Users.create({
                email: payload.email,
                username: payload.username,
                password: payload.password,
                profile: newProfile,
            });
            return await trans.save(newUser);
        });
    }
    catch (err) {
        if (err.code.includes('ER_DUP_ENTRY')) {
            throw new CustomError(`User with email: ${payload.email} already exists.`, 409);
        }
        throw new CustomError(err, 500);
    }
};
const login = async (email, password) => {
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
                }, process.env.SECRET_KEY || '', {
                    expiresIn: '30m'
                });
                return { username: info.username, email: email, token };
            }
            else {
                throw new CustomError(`Invalid password`, 401);
            }
        }
        else {
            throw new CustomError(`Invalid email.`, 400);
        }
    }
    catch (err) {
        if (err instanceof CustomError)
            throw (err);
        throw new CustomError(`An error occurred while trying to log you in. Error: ${err}`, 500);
    }
};
const calculateBalance = async (req) => {
    try {
        return `Your account Balance : ${await totalIncomes(req) - await totalExpenses(req)}`;
    }
    catch (err) {
        throw new CustomError(`Unexpected Error ${err}`, 500);
    }
};
const createUserUnderRoot = async (payload, res) => {
    return await dataSource.transaction(async (trans) => {
        const newProfile = Profile.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            phoneNumber: payload.phoneNumber,
            role: 'User',
        });
        await trans.save(newProfile);
        const newUser = Users.create({
            email: payload.email,
            username: payload.username,
            password: payload.password,
            profile: newProfile,
            business: res.locals.user.business,
        });
        await trans.save(newUser.business);
        return await trans.save(newUser);
    });
};
const rootUserDescendant = async (res, descendantID) => {
    const descendant = await Users.findOne({ where: { business: res.locals.user.business, id: descendantID } });
    return descendant;
};
const deleteDescendant = async (descendantID, res) => {
    try {
        return await dataSource.transaction(async (trans) => {
            const descendant = await rootUserDescendant(res, descendantID);
            if (descendant) {
                throw new CustomError('User not found in your business', 404);
            }
            await trans.remove(Users, descendant);
        });
    }
    catch (err) {
        throw (err);
    }
};
export { insertUser, login, calculateBalance, createUserUnderRoot, deleteDescendant, };
//# sourceMappingURL=User.js.map