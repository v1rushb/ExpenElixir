import dataSource from "../db/dataSource.js";
import { Profile } from "../db/entities/Profile.js";
import { Users } from "../db/entities/Users.js";
import { CustomError } from '../CustomError.js';
import { Income } from '../db/entities/Income.js';
import { Expense } from '../db/entities/Expense.js';
import { Category } from '../db/entities/Category.js';
const createUserUnderRoot = async (payload, res) => {
    return await dataSource.transaction(async (trans) => {
        const newProfile = Profile.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            phoneNumber: payload.phoneNumber,
            role: 'User',
        });
        await trans.save(newProfile);
        const iamId = `${Date.now()}`;
        const newUser = Users.create({
            email: payload.email,
            username: payload.username,
            password: payload.password,
            profile: newProfile,
            business: res.locals.user.business,
            iamId,
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
const businessUsers = async (res) => {
    const users = await Users.find({ where: { business: res.locals.user.business } });
    return users;
};
const businessBalance = async (res) => {
    try {
        return await totalBusinessIncome(res) - await totalBusinessExpenses(res);
    }
    catch (err) {
        throw new CustomError(`Unexpected Error ${err}`, 500);
    }
};
const addUserIncome = async (payload, userID, res) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to add an income to!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        return dataSource.manager.transaction(async (trans) => {
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
    }
    catch (err) {
        throw err;
    }
};
const deleteUserIncome = async (incomeID, userID, res) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to delete an income from!`, 400);
        if (!incomeID)
            throw new CustomError(`You must provide an id for the income you want to delete!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        const incomes = user.incomes;
        const income = incomes.find(income => income.id === incomeID);
        if (!income) {
            throw new CustomError("Income not found.", 404);
        }
        await Income.remove(income);
    }
    catch (err) {
        throw err;
    }
};
const businessIncome = async (res) => {
    const users = await Users.find({ where: { business: res.locals.user.business } });
    const result = users.flatMap(user => user.incomes.map(income => ({ ...income, userId: user.id })));
    return result;
};
const totalBusinessIncome = async (res) => {
    const incomes = await businessIncome(res);
    return incomes ? incomes.reduce((acc, income) => acc + income.amount, 0) : 0;
};
const addUserExpense = async (payload, userID, res, picFile) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to add an expense to!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        return dataSource.manager.transaction(async (trans) => {
            const newExpense = Expense.create({
                title: payload.title,
                amount: Number(payload.amount),
                expenseDate: payload.expenseDate,
                description: payload.description,
                picURL: picFile?.location
            });
            await trans.save(newExpense);
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
        throw err;
    }
};
const deleteUserExpense = async (expenseID, userID, res) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to delete an expense from!`, 400);
        if (!expenseID)
            throw new CustomError(`You must provide an id for the expense you want to delete!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        const expense = await Expense.findOne({
            where: { id: expenseID },
        });
        if (expense) {
            const correctExpense = await Users.findOne({
                where: { id: expense.users }
            });
        }
        if (!expense) {
            throw new CustomError(`Expense not found.`, 404);
        }
        await Expense.remove(expense);
    }
    catch (err) {
        throw err;
    }
};
const businessExpenses = async (res) => {
    try {
        const users = await Users.find({ where: { business: res.locals.user.business } });
        const result = users.flatMap(user => user.expenses.map(expense => ({ ...expense, userId: user.id })));
        return result;
    }
    catch (err) {
        throw (err);
    }
};
const totalBusinessExpenses = async (res) => {
    const expenses = await businessExpenses(res);
    return expenses ? expenses.reduce((acc, expense) => acc + expense.amount, 0) : 0;
};
const addUserCategory = async (payload, userID, res) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to add a category to!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        return dataSource.manager.transaction(async (trans) => {
            const newCategory = Category.create({
                title: payload.title, description: payload.description,
            });
            await trans.save(newCategory);
            user.categories.push(newCategory);
            await trans.save(user);
        });
    }
    catch (err) {
        throw err;
    }
};
const deleteUserCategory = async (categoryID, userID, res) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to delete a category from!`, 400);
        if (!categoryID)
            throw new CustomError(`You must provide an id for the category you want to delete!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        const category = await Category.findOne({
            where: { id: categoryID },
        });
        if (!category || category.users !== user.id) {
            throw new CustomError("Income not found.", 404);
        }
        await Category.remove(category);
    }
    catch (err) {
        throw err;
    }
};
const businessCategories = async (res) => {
    const users = await Users.find({ where: { business: res.locals.user.business } });
    const result = users.flatMap(user => user.categories.map(category => ({ ...category, userId: user.id })));
    return result;
};
export { createUserUnderRoot, deleteDescendant, businessUsers, businessBalance, addUserIncome, deleteUserIncome, businessIncome, totalBusinessIncome, addUserExpense, deleteUserExpense, businessExpenses, totalBusinessExpenses, addUserCategory, deleteUserCategory, businessCategories, };
//# sourceMappingURL=Business.js.map