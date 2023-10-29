import dataSource from "../db/dataSource.js";
import { Expense } from "../db/entities/Expense.js";
import { Users } from '../db/entities/Users.js';
import { Category } from '../db/entities/Category.js';
import { CustomError } from '../CustomError.js';
import { currencyConverterFromOtherToUSD, expenseOnProfileCurrency } from '../utils/currencyConverter.js';
import { Between, EqualOperator, Like } from 'typeorm';
import { sendEmail } from '../utils/sesServiceAws.js';
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
                picURL: payload.picFile?.location
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
            category.totalExpenses += newExpense.amount;
            await trans.save(user);
            await trans.save(category);
            if (category.totalExpenses >= (category.budget * 0.9)) {
                let emailBody = '';
                let emailSubject = '';
                if (category.totalExpenses < category.budget) {
                    emailBody = `You are about to reach your budget limit for ${category.title}. You have spent ${category.totalExpenses} out of ${category.budget} for ${category.title}.`;
                    emailSubject = `You are about to reach your budget limit for ${category.title}`;
                }
                else if (category.totalExpenses === category.budget) {
                    emailBody = `You have reached your budget limit for ${category.title}. You have spent ${category.totalExpenses} out of ${category.budget} for ${category.title}.`;
                    emailSubject = `You have reached your budget limit for ${category.title}`;
                }
                else {
                    emailBody = `You have exceeded your budget limit for ${category.title}. You have spent ${category.totalExpenses} out of ${category.budget} for ${category.title}.`;
                    emailSubject = `You have exceeded your budget limit for ${category.title}`;
                }
                await sendEmail(user.email, emailBody, emailSubject);
            }
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
const deleteExpense = async (payload) => {
    try {
        const { id } = payload;
        if (!id)
            throw new CustomError("ID is required.", 400);
        const expense = await Expense.findOne({ where: { id: id } });
        if (!expense)
            throw new CustomError(`Expense with id: ${id} was not found!`, 404);
        const expenseName = expense.title;
        await Expense.remove(expense);
        return expenseName;
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
const getFilteredExpenses = async (payload, req, res) => {
    try {
        let filter = {
            ...res.locals.filter, where: {
                users: new EqualOperator(res.locals.user.id),
                amount: Between(Number(payload.minAmountQuery) || 0, Number(payload.maxAmountQuery) || 9223372036854775807),
                title: Like(`%${payload.searchQuery?.toString().toLowerCase() || ''}%`),
            }
        };
        if (payload.category) {
            filter.where.category = new EqualOperator(payload.category);
        }
        const expenses = await Expense.find(filter);
        const results = await expenseOnProfileCurrency(expenses, res.locals.user.profile.Currency);
        return results;
    }
    catch (err) {
        throw err;
    }
};
const updateExpense = async (expenseId, payload, res) => {
    try {
        await dataSource.transaction(async (trans) => {
            const existingExpense = await Expense.findOne({ where: { id: new EqualOperator(expenseId), users: new EqualOperator(res.locals.user.id) } });
            if (!existingExpense) {
                throw new CustomError("Expense not found.", 404);
            }
            const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || 'USD');
            existingExpense.title = payload.title;
            existingExpense.amount = currency.amount;
            existingExpense.expenseDate = payload.expenseDate;
            existingExpense.description = payload.description;
            existingExpense.picURL = payload.picFile?.location || existingExpense.picURL;
            await trans.save(existingExpense);
            const category = await Category.findOne({ where: { id: payload.category }, relations: ["expenses"] });
            if (!category) {
                throw new CustomError("Category not found.", 404);
            }
            const categoryTyped = category;
            categoryTyped.totalExpenses += existingExpense.amount - existingExpense.amount;
            await trans.save(res.locals.user);
            await trans.save(categoryTyped);
            if (categoryTyped.totalExpenses >= (categoryTyped.budget * 0.9)) {
                let emailBody = '';
                let emailSubject = '';
                if (categoryTyped.totalExpenses < categoryTyped.budget) {
                    emailBody = `You are about to reach your budget limit for ${categoryTyped.title}. You have spent ${categoryTyped.totalExpenses} out of ${categoryTyped.budget} for ${categoryTyped.title}.`;
                    emailSubject = `You are about to reach your budget limit for ${categoryTyped.title}`;
                }
                else if (categoryTyped.totalExpenses === categoryTyped.budget) {
                    emailBody = `You have reached your budget limit for ${categoryTyped.title}. You have spent ${categoryTyped.totalExpenses} out of ${categoryTyped.budget} for ${categoryTyped.title}.`;
                    emailSubject = `You have reached your budget limit for ${categoryTyped.title}`;
                }
                else {
                    emailBody = `You have exceeded your budget limit for ${categoryTyped.title}. You have spent ${categoryTyped.totalExpenses} out of ${categoryTyped.budget} for ${categoryTyped.title}.`;
                    emailSubject = `You have exceeded your budget limit for ${categoryTyped.title}`;
                }
                await sendEmail(res.locals.user.email, emailBody, emailSubject);
            }
        });
    }
    catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }
        throw new CustomError(err, 500);
    }
};
export { insertExpense, deleteAllExpenses, deleteExpense, totalExpenses, getExpenses, getFilteredExpenses, updateExpense, };
//# sourceMappingURL=Expense.js.map