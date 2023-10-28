import express from 'express';
import { Gen } from "../@types/generic.js";
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
import { ChatGPTAPI, ChatMessage } from 'chatgpt';


const createUserUnderRoot = async (payload: Gen.User, res: express.Response): Promise<void> => {
    try {
        await dataSource.transaction(async trans => {
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
            const emailSubject = 'ExpenElixir Email Verification';
            sendEmail(emailBody, emailSubject);

            await trans.save(newUser.business);
            return await trans.save(newUser);
        });
    } catch (err: any) {
        if (err.code?.includes('ER_DUP_ENTRY')) {
            throw new CustomError(`User with email: ${payload.email} or username: ${payload.username} already exists.`, 409);
        }
    }
}

const rootUserDescendant = async (res: express.Response, descendantID: string): Promise<Users> => {
    const descendant = await Users.findOne({ where: { business: res.locals.user.business, id: descendantID } }) as Users;
    return descendant;
}

const deleteDescendant = async (res: express.Response, descendantID: string): Promise<void> => {
    try {
        return await dataSource.transaction(async trans => {
            const descendant = await rootUserDescendant(res, descendantID);
            if (descendant) {
                throw new CustomError('User not found in your business', 404);
            }

            await trans.remove(Users, descendant);
        });
    } catch (err) {
        throw (err);
    }
};

const businessUsers = async (res: express.Response): Promise<Users[]> => {
    return await Users.find({ where: { business: res.locals.user.business } }) as Users[];
}

const businessBalance = async (res: express.Response): Promise<number> => {
    try {
        return await totalBusinessIncome(res) - await totalBusinessExpenses(res);
    }
    catch (err) {
        throw new CustomError(`Unexpected Error ${err}`, 500);
    }
}

const addUserIncome = async (payload: Gen.Income, userID: string, res: express.Response): Promise<void> => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to add an income to!`, 400);
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
    } catch (err) {
        throw err;
    }
}

const deleteUserIncome = async (incomeID: string, userID: string, res: express.Response): Promise<void> => {
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
    } catch (err) {
        throw err;
    }
}

const businessIncome = async (res: express.Response) => {
    const users = await Users.find({ where: { business: res.locals.user.business } }) as Users[];
    return users.flatMap(user => user.incomes.map(income => ({ ...income, userId: user.id })));
}

const totalBusinessIncome = async (res: express.Response): Promise<number> => {
    const incomes = await businessIncome(res);
    return incomes ? incomes.reduce((acc: any, income: { amount: number; }) => acc + income.amount, 0) : 0
}

const modifyUserIncome = async (incomeID: string, userID: string, payload: Gen.Income, res: express.Response) => {
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

        const userIncomes: Income[] = user.incomes;
        const income = userIncomes.find(income => income.id === incomeID);
        if (!income) {
            throw new CustomError(`Income with id: ${incomeID} was not found!`, 404);
        }
        const currency = await currencyConverterFromOtherToUSD(Number(payload.amount), payload.currencyType || "USD")
        income.title = payload.title;
        income.amount = currency.amount;
        income.incomeDate = payload.incomeDate;
        income.description = payload.description;
        await income.save();
    } catch (err) {
        throw err;
    }
}

const addUserExpense = async (payload: Gen.addUserExpense, res: express.Response) => {

    try {
        if (!payload.userID)
            throw new CustomError(`You must provide an id for the user you want to add an expense to!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: payload.userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        return dataSource.manager.transaction(async trans => {

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
                } else if (category.totalExpenses === category.budget) {
                    emailBody = `You have reached your budget limit for ${category.title}. You have spent ${category.totalExpenses} out of ${category.budget} for ${category.title}.`;
                    emailSubject = `You have reached your budget limit for ${category.title}`;
                } else {
                    emailBody = `You have exceeded your budget limit for ${category.title}. You have spent ${category.totalExpenses} out of ${category.budget} for ${category.title}.`;
                    emailSubject = `You have exceeded your budget limit for ${category.title}`;
                }
                await sendEmail(emailBody, emailSubject);
            }
        });
    } catch (err) {
        throw err;
    }
}

const deleteUserExpense = async (payload: Gen.deleteUserExpense, res: express.Response): Promise<void> => {
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
    } catch (err) {
        throw err;
    }
}

const businessExpenses = async (res: express.Response) => {
    try {
        const users = await Users.find({ where: { business: res.locals.user.business } }) as Users[];
        const result = users.flatMap(user => user.expenses.map(expense => ({ ...expense, userId: user.id })));
        return result;
    } catch (err) {
        throw (err);
    }
}

const totalBusinessExpenses = async (res: express.Response): Promise<number> => { // fix error handling later
    const expenses = await businessExpenses(res);
    return expenses ? expenses.reduce((acc, expense) => acc + expense.amount, 0) : 0
}

const addUserCategory = async (payload: Gen.Category, userID: string, res: express.Response): Promise<void> => {
    try {
        if (!userID)
            throw new CustomError(`You must provide an id for the user you want to add a category to!`, 400);
        const user = await Users.findOne({
            where: { business: res.locals.user.business, id: userID },
        });
        if (!user) {
            throw new CustomError(`User not found.`, 404);
        }
        return dataSource.manager.transaction(async trans => {

            const newCategory = Category.create({
                title: payload.title, description: payload.description,
            });
            await trans.save(newCategory);
            user.categories.push(newCategory);
            await trans.save(user);
        });
    } catch (err) {
        throw err;
    }
}


const deleteUserCategory = async (categoryID: string, userID: string, res: express.Response): Promise<void> => {
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
    } catch (err) {
        throw err;
    }
}
const businessCategories = async (res: express.Response) => {
    const users = await Users.find({ where: { business: res.locals.user.business } }) as Users[];
    const result = users.flatMap(user => user.categories.map(category => ({ ...category, userId: user.id })));
    return result;
}

const upgradeToBusiness = async (res: express.Response) => {
    try {
        const user = res.locals.user;
        if (res.locals.user.business) {
            user.profile.role = 'Root';
            return await user.save();
        }
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
    } catch (err) {
        throw (err);
    }
}

const getFilteredExpenses = async (payload: Gen.getFilteredBusinessExpenses, req: express.Request, res: express.Response) => {

    try {
        const Expenses = await businessExpenses(res);// put authme in router, else it wont work.

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
    } catch (err) {
        throw err;
    }
}

const modifyUserExpense = async (expenseID: string, userID: string, payload: Gen.Expense, res: express.Response, picFile: Express.MulterS3.File) => {
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

        const userExpenses: Expense[] = user.expenses;
        const expense = userExpenses.find(expense => expense.id === expenseID);
        if (!expense) {
            throw new CustomError(`Expense with id: ${expenseID} was not found!`, 404);
        }
        const category = await Category.findOne({
            where: { id: payload.category! },
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

    } catch (err) {
        throw err;
    }
} // this controller is not done yet.

const modifyUserCategory = async (categoryID: string, userID: string, payload: Gen.Category, res: express.Response) => {
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

        const userCategories: Category[] = user.categories;
        const category = userCategories.find(category => category.id === categoryID);
        if (!category) {
            throw new CustomError(`Category with id: ${categoryID} was not found!`, 404);
        }
        category.title = payload.title;
        category.description = payload.description;
        await category.save();
    } catch (err) {
        throw err;
    }
}

const recommendation = async (res: express.Response) => {
    const users: Users[] = await businessUsers(res);
    const result: { username: string, userId: string, incomeExpenseDiff: number }[] = [];
    for (const user of users) {

        const incomeAmount = await user.incomes.reduce((acc, income) => acc + income.amount, 0);
        const expenseAmount = await user.expenses.reduce((acc, expense) => acc + expense.amount, 0);
        if (user.profile.role !== 'Root')
            result.push({ username: user.username, userId: user.id, incomeExpenseDiff: incomeAmount - expenseAmount });
    }
    return result;
}

const sortRecommendation = (result: { username: string, userId: string, incomeExpenseDiff: number }[]): { username: string, userId: string, incomeExpenseDiff: number }[] => {
    return result.sort((a, b) => b.incomeExpenseDiff - a.incomeExpenseDiff);
}

const getAdvice = async (inputArr: { username: string, userId: string, incomeExpenseDiff: number }[]) => {
    const api = new ChatGPTAPI({ apiKey: process.env.CHATGPTAPI_SECRET_KEY || '' });
    let message = '';
    for (const user of inputArr) {
        const { username, incomeExpenseDiff } = user;
        message += `User ${username} has an income-expense difference of ${incomeExpenseDiff}.\n`;
    }
    const res: ChatMessage = await api.sendMessage(`I will give you an array of objects. each element of that array will contain username, user id and incomeExpenseDiff, incomeExpenseDiff represents income amount (money brought to business) minus expense amount (money taken from business) for each user. and out of this array I want you to tell me which user out of all of these users should I give a promotion? and give me a short reason why should I do that so. data: ${message}, I want your answer to be in 2 section, first section is stating the name of that user ONLY, second one is a breif paragraph that states the reason.`)
    return res.text.toString();
}

const getFireAdvice = async (inputArr: { username: string, userId: string, incomeExpenseDiff: number }[]) => {
    const api = new ChatGPTAPI({ apiKey: process.env.CHATGPTAPI_SECRET_KEY || '' });
    let message = '';
    for (const user of inputArr) {
        const { username, incomeExpenseDiff } = user;
        message += `User ${username} has an income-expense difference of ${incomeExpenseDiff}.\n`;
    }
    const res: ChatMessage = await api.sendMessage(`I will give you an array of objects. each element of that array will contain username, user id and incomeExpenseDiff, incomeExpenseDiff represents income amount (money brought to business) minus expense amount (money taken from business) for each user. and out of this array I want you to tell me which user out of all of these users should I fire? and give me a short reason why should I do that so. data: ${message}, I want your answer to be in 2 section, first section is stating the name of that user ONLY, second one is a breif paragraph that states the reason.`)
    return res.text.toString();
}

export {
    createUserUnderRoot,
    deleteDescendant,
    businessUsers,
    businessBalance,
    addUserIncome,
    deleteUserIncome,
    businessIncome,
    totalBusinessIncome,
    addUserExpense,
    deleteUserExpense,
    businessExpenses,
    totalBusinessExpenses,
    addUserCategory,
    deleteUserCategory,
    businessCategories,
    upgradeToBusiness,
    getFilteredExpenses,
    modifyUserIncome,
    modifyUserCategory,
    modifyUserExpense,
    recommendation,
    sortRecommendation,
    getAdvice,
    getFireAdvice,
}