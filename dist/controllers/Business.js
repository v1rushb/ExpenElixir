import dataSource from "../db/dataSource.js";
import { Profile } from "../db/entities/Profile.js";
import { Users } from "../db/entities/Users.js";
import { CustomError } from '../CustomError.js';
import { Income } from '../db/entities/Income.js';
import { Expense } from '../db/entities/Expense.js';
import { Category } from '../db/entities/Category.js';
import { Business } from '../db/entities/Business.js';
import { currencyConverterFromOtherToUSD } from '../utils/currencyConverter.js';
import { sendEmail } from '../utils/sesServiceAws.js';
import { v4 as uuidv4 } from 'uuid';
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
        const verificationToken = uuidv4();
        newUser.verificationToken = verificationToken;
        const host = process.env.HOST || 'localhost:2077';
        const verificationLink = 'http://' + host + '/user/verify-account?token=' + verificationToken;
        const emailBody = 'Please verify your account by clicking the link: \n' + verificationLink;
        const emailSubject = 'EpenElixir Email Verification';
        sendEmail(emailBody, emailSubject);
        await trans.save(newUser.business);
        return await trans.save(newUser);
    });
};
const rootUserDescendant = async (res, descendantID) => {
    const descendant = await Users.findOne({ where: { business: res.locals.user.business, id: descendantID } });
    return descendant;
};
const deleteDescendant = async (res, descendantID) => {
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
    return await Users.find({ where: { business: res.locals.user.business } });
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
    return users.flatMap(user => user.incomes.map(income => ({ ...income, userId: user.id })));
};
const totalBusinessIncome = async (res) => {
    const incomes = await businessIncome(res);
    return incomes ? incomes.reduce((acc, income) => acc + income.amount, 0) : 0;
};
const modifyUserIncome = async (incomeID, userID, payload, res) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to modify an income from!`, 400);
        if (!incomeID)
            throw new CustomError(`You must provide an id for the income you want to modify!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user)
            throw new CustomError(`User not found.`, 404);
        const userIncomes = user.incomes;
        const income = userIncomes.find(income => income.id === incomeID);
        if (!income) {
            throw new CustomError(`Income with id: ${incomeID} was not found!`, 404);
        }
        const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || "USD");
        income.title = payload.title;
        income.amount = currency.amount;
        income.incomeDate = payload.incomeDate;
        income.description = payload.description;
        await income.save();
    }
    catch (err) {
        throw err;
    }
};
const addUserExpense = async (payload, res) => {
    try {
        if (!payload.userID)
            throw new CustomError(`You must provide an id for the user you want to add an expense to!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: payload.userID },
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
                picURL: payload.picFile?.location
            });
            await trans.save(newExpense);
            const category = await Category.findOne({
                where: { id: payload.category },
                relations: ["expenses"],
            });
            if (!category) {
                throw new CustomError(`Category not found.`, 404);
            }
            category.totalExpenses += newExpense.amount;
            user.expenses.push(newExpense);
            category.expenses.push(newExpense);
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
                await sendEmail(emailBody, emailSubject);
            }
        });
    }
    catch (err) {
        throw err;
    }
};
const deleteUserExpense = async (payload, res) => {
    try {
        if (!payload.userID)
            throw new CustomError(`You must provide an id for the user you want to delete an expense from!`, 400);
        if (!payload.expenseID)
            throw new CustomError(`You must provide an id for the expense you want to delete!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: payload.userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        const expense = await Expense.findOne({
            where: { id: payload.expenseID },
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
const upgradeToBusiness = async (res) => {
    try {
        const user = res.locals.user;
        console.log(`profiles are ${user.profile}`);
        if (user.profile) {
            user.profile.role = 'Root';
            user.profile.subscription_date = new Date();
            user.profile.hasSentEmail = false;
            await user.profile.save();
            const newBusiness = Business.create({
                businessName: user.profile.firstName + "'s Business",
                rootUserID: user.id,
                users: [user],
            });
            await newBusiness.save();
            user.business = newBusiness;
            await user.save();
        }
    }
    catch (err) {
        throw (err);
    }
};
const getFilteredExpenses = async (payload, req, res) => {
    try {
        const Expenses = await businessExpenses(res); // put authme in router, else it wont work.
        if (!payload.searchQuery && !payload.minAmountQuery && !payload.maxAmountQuery && !payload.userIDQuery)
            return Expenses;
        const search = payload.searchQuery || '';
        const minAmount = Number(payload.minAmountQuery) || -Infinity;
        const maxAmount = Number(payload.maxAmountQuery) || Infinity;
        const userID = payload.userIDQuery;
        const filteredExpenses = Expenses.filter(expense => expense.amount >= minAmount && expense.amount <= maxAmount && expense.title.toLowerCase().includes(search));
        if (!userID)
            return filteredExpenses;
        else {
            const newFilteredExpenses = filteredExpenses.filter(expense => expense.userId === userID);
            return newFilteredExpenses;
        }
    }
    catch (err) {
        throw err;
    }
};
const modifyUserExpense = async (expenseID, userID, payload, res, picFile) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to modify an expense from!`, 400);
        if (!expenseID)
            throw new CustomError(`You must provide an id for the expense you want to modify!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user)
            throw new CustomError(`User not found.`, 404);
        const userExpenses = user.expenses;
        const expense = userExpenses.find(expense => expense.id === expenseID);
        if (!expense) {
            throw new CustomError(`Expense with id: ${expenseID} was not found!`, 404);
        }
        const category = await Category.findOne({
            where: { id: payload.category },
            relations: ["expenses"],
        });
        if (!category) {
            throw new CustomError(`Category not found.`, 404);
        }
        expense.title = payload.title;
        expense.amount = Number(payload.amount);
        expense.expenseDate = payload.expenseDate;
        expense.description = payload.description;
        expense.picURL = picFile?.location;
        await expense.save();
    }
    catch (err) {
        throw err;
    }
}; // this controller is not done yet.
const modifyUserCategory = async (categoryID, userID, payload, res) => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to modify a category from!`, 400);
        if (!categoryID)
            throw new CustomError(`You must provide an id for the category you want to modify!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user)
            throw new CustomError(`User not found.`, 404);
        const userCategories = user.categories;
        const category = userCategories.find(category => category.id === categoryID);
        if (!category) {
            throw new CustomError(`Category with id: ${categoryID} was not found!`, 404);
        }
        category.title = payload.title;
        category.description = payload.description;
        await category.save();
    }
    catch (err) {
        throw err;
    }
};
export { createUserUnderRoot, deleteDescendant, businessUsers, businessBalance, addUserIncome, deleteUserIncome, businessIncome, totalBusinessIncome, addUserExpense, deleteUserExpense, businessExpenses, totalBusinessExpenses, addUserCategory, deleteUserCategory, businessCategories, upgradeToBusiness, getFilteredExpenses, modifyUserIncome, modifyUserCategory, };
//# sourceMappingURL=Business.js.map