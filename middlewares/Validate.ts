import express from 'express';
import isEmail from 'validator/lib/isEmail.js';
import { passwordStrength } from 'check-password-strength';
import { CustomError } from '../CustomError.js';



const validateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const values = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'username'];
    const errorList: string[] = [];
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/;

    values.forEach(iterator => {
        if (!req.body[iterator]) {
            errorList.push(`${iterator} is Required.`);
        }
    });

    const user = req.body;

    try {
        if (!emailRegex.test(user.email) && !errorList.find(iterator=> iterator === 'email is Required.')) {
            errorList.push(`Invalid email.`);
        }
        
        if (!passwordRegex.test(user.password) && !errorList.find(iterator=> iterator === 'password is Required.')) {
            errorList.push(`Password must be at least 10 characters and include at least one uppercase letter, one lowercase letter, and one number.`);
        }
    } catch (err) {
        console.error(err);
        return res.status(400).send(`Empty body!`);
    }

    if (errorList.length) {
        return res.status(400).send(errorList.join('\n'));
    }
  
    next();
};

const validateExpense = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if (!req.body)
            throw new CustomError(`Empty body!`, 400);
        const values = ['title', 'amount', 'expenseDate'];
        const errorList: string[] = [];
        values.forEach(iterator => {
            if (!req.body[iterator])
                if (!(iterator === 'amount' && req.body[iterator] === 0)) {
                    return void errorList.push(`${iterator} is Required.`);
                }

        });
        const expense = req.body;
        if (expense.amount <= 0)
            errorList.push(`Amount must be greater than 0.`);

        if (errorList.length)
            return res.status(400).send(errorList.join('\n'));

        return next();
    } catch (err) {
        next(err);
    }
}

const validateIncome = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if (!req.body)
            throw new CustomError(`Empty body!`, 400);
        const values = ['title', 'amount', 'incomeDate'];
        const errorList: string[] = [];
        values.forEach(iterator => {
            if (!req.body[iterator])
                return void errorList.push(`${iterator} is Required.`);
        });
        const income = req.body;
        if (income.amount <= 0)
            errorList.push(`Amount must be greater than 0.`);

        if (errorList.length)
            return res.status(400).send(errorList.join('\n'));

        return next();
    } catch (err) {
        next(err);
    }
}

const validateCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => { //ik making this whole code for one metafield seems ridiculous but i'm doing it anyway ;P
    try {
        if (!req.body)
            throw new CustomError(`Empty body!`, 400);
        const values = ['title','budget'];
        const errorList: string[] = [];
        values.forEach(iterator => {
            if (!req.body[iterator])
                return void errorList.push(`${iterator} is Required.`);
        });
        if (errorList.length)
            return res.status(400).send(errorList.join('\n'));

        return next();
    } catch (err) {
        next(err);
    }
}

const validateEmail = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = req.body.email;

    if (!email || !emailRegex.test(email)) {
        return res.status(400).send('Invalid email.');
    }
  
    next();
};

const validatePassword = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{10,}$/;
    const password = req.body.newPassword;

    if (!password || !passwordRegex.test(password)) {
        return res.status(400).send('Password must be at least 10 characters and include at least one uppercase letter, one lowercase letter, and one number and special characters.');
    }

    next();
};

const validateLogin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const {email,password} = req.body;

        const values = ['password', 'username'];
        const errorList: string[] = [];
        values.forEach(iterator => {
            if (!req.body[iterator])
                return void errorList.push(`${iterator} is Required.`);
        });
        if (errorList.length)
        return res.status(400).send(errorList.join('\n'));

        return next();
    } catch(err) {
        next(err);
    }

}


export {
    validateUser,
    validateExpense,
    validateIncome,
    validateCategory,
    validateEmail,
    validatePassword,
    validateLogin,
}