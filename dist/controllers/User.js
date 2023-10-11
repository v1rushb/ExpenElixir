import dataSource from "../db/dataSource.js";
import { Users } from "../db/entities/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { totalIncomes } from './Income.js';
import { totalExpenses } from './Expense.js';
const insertUser = async (payload) => {
    return await dataSource.transaction(async (trans) => {
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
                throw ("invalid password.");
            }
        }
        else {
            throw ("invalid email.");
        }
    }
    catch (err) {
        throw (`An error occured while trying to log you in. error: ${err}`);
    }
};
const calculateBalance = async (req) => {
    try {
        return `Your account Balance : ${await totalIncomes(req) - await totalExpenses(req)}`;
    }
    catch (err) {
        throw (`Unexpected Error ${err}`);
    }
};
export { insertUser, login, calculateBalance, };
//# sourceMappingURL=User.js.map