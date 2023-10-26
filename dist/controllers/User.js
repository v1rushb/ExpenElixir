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
            const { firstName, lastName, phoneNumber } = payload;
            const newProfile = Profile.create({ firstName, lastName, phoneNumber, hasSentEmail: false });
            await trans.save(newProfile);
            const { email, username, password } = payload;
            const newUser = Users.create({ email, username, password, profile: newProfile, });
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
const login = async (username, password, iamId, res) => {
    try {
        const user = await Users.findOne({
            where: { username },
        });
        if (!user || user.username !== username) {
            throw new CustomError('Invalid credentials', 400);
        }
        if (user.profile.role === 'User') {
            if (!iamId || user.iamId !== iamId) {
                throw new CustomError('IAM users must provide a valid IAM ID', 401);
            }
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new CustomError('Invalid password', 401);
        }
        const token = jwt.sign({
            email: user.email,
            username: user.username,
            id: user.id,
        }, process.env.SECRET_KEY || '', {
            expiresIn: '30m',
        });
        return { username: user.username, email: user.email, token };
    }
    catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }
        throw new CustomError(`An error occurred during login. Error: ${err}`, 501);
    }
};
const calculateBalance = async (res) => {
    try {
        return `Your account Balance : ${await totalIncomes(res) - await totalExpenses(res)}`;
    }
    catch (err) {
        throw new CustomError(`Unexpected Error ${err}`, 500);
    }
};
const deleteUser = async (res) => {
    try {
        await Users.delete(res.locals.user.id);
    }
    catch (err) {
        throw new CustomError(`Error deleting user: ${err}`, 500);
    }
};
export { insertUser, login, calculateBalance, deleteUser };
//# sourceMappingURL=User.js.map