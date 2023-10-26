import dataSource from "../db/dataSource.js";
import { Expense } from "../db/entities/Expense.js";
import { Users } from '../db/entities/Users.js';
import { Category } from '../db/entities/Category.js';
import { CustomError } from '../CustomError.js';
import { currencyConverterFromOtherToUSD, expenseOnProfileCurrency } from '../utils/currencyConverter.js';
import { Between, EqualOperator, Like } from 'typeorm';
const insertExpense = async (payload, res) => {
    try {
        return dataSource.manager.transaction(async (trans) => {
            const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || 'USD');
            const newExpense = Expense.create({
                title: payload.title,
                amount: currency.amount,
                expenseDate: payload.expenseDate,
                description: payload.description,
                data: JSON.stringify(currency.currencyData),
            });
            await trans.save(newExpense);
            const user = await Users.findOne({
                where: { id: res.locals.user.id },
                relations: ["expenses"],
            });
            if (!user) {
                throw new CustomError(`User not found.`, 404);
            }
            const category = await Category.findOne({
                where: { id: payload.category },
                relations: ["expenses"],
            });
            if (!category) {
                throw new CustomError(`Category not found.`, 404);
            }
            user.expenses.push(newExpense);
            category.expenses.push(newExpense);
            await trans.save(user);
            await trans.save(category);
        });
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError('err', 500);
    }
};
const deleteAllExpenses = async (res) => {
    await Expense.delete({ users: new EqualOperator(res.locals.user.id) });
};
const deleteExpense = async (id) => {
    try {
        const expense = await Expense.findOne({ where: { id } });
        if (!expense)
            throw new CustomError(`Expense with id: ${id} was not found!`, 404);
        await Expense.remove(expense);
        return expense;
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
};
const totalExpenses = async (res) => {
    const expenses = await Expense.find({
        where: { users: new EqualOperator(res.locals.user.id) }
    });
    const total = expenses ? expenses.reduce((acc, expense) => acc + expense.amount, 0) : 0;
    return total;
};
const getExpenses = async (req, res) => {
    try {
        const filter = { ...res.locals.filter, where: { users: new EqualOperator(res.locals.user.id) } };
        const expenses = await Expense.find(filter);
        const results = await expenseOnProfileCurrency(expenses, res.locals.user.profile.Currency);
        return results;
    }
    catch (err) {
        console.log(err);
        if (err instanceof CustomError) {
            throw new CustomError(err.message, err.statusCode);
        }
        throw new CustomError(`Internal Server Error`, 500);
    }
};
// const getFilteredExpenses = async (req: express.Request, res: express.Response): Promise<Expense[]> => {
//     try {
//         const userId = req.cookies['userId'];
//         const search = req.query.search?.toString().toLowerCase() || '';
//         const minAmount = Number(req.query.minAmount) || 0
//         const maxAmount = Number(req.query.maxAmount) || Infinity
//         const expense = await Users.findOne({
//             where: { id: userId },
//             relations: ['expenses'],
//         });
//         if (!expense) throw new CustomError('User not found', 404);
//         const filteredExpenses: Expense[] = expense.expenses.filter(expense => {
//             return expense.amount >= minAmount && expense.amount <= maxAmount &&
//                 expense.title.toLowerCase().includes(search);
//         });
//         const expenseOnProfileCurrency = await Promise.all(
//             filteredExpenses.map(async (expense) => {
//                 const amount = await currencyConverterFromUSDtoOther(expense.amount, res.locals.user.profile.Currency, expense.data);
//                 return { ...expense, amount };
//             })
//         );
//         return expenseOnProfileCurrency as unknown as Promise<Expense[]>;
//     } catch (err) {
//         throw err;
//     }
// };
const getFilteredExpenses = async (searchQuery, minAmountQuery, maxAmountQuery, category, req, res) => {
    try {
        let filter = {
            ...res.locals.filter, where: {
                users: new EqualOperator(res.locals.user.id),
                amount: Between(Number(minAmountQuery) || 0, Number(maxAmountQuery) || 9223372036854775807),
                title: Like(`%${searchQuery?.toString().toLowerCase() || ''}%`),
            }
        };
        if (category) {
            filter.where.category = new EqualOperator(category);
        }
        const expenses = await Expense.find(filter);
        const results = await expenseOnProfileCurrency(expenses, res.locals.user.profile.Currency);
        return results;
    }
    catch (err) {
        throw err;
    }
};
export { insertExpense, deleteAllExpenses, deleteExpense, totalExpenses, getExpenses, getFilteredExpenses, };
//# sourceMappingURL=Expense.js.map