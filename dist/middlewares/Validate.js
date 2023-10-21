import isEmail from 'validator/lib/isEmail.js';
import { passwordStrength } from 'check-password-strength';
import { CustomError } from '../CustomError.js';
const validateUser = async (req, res, next) => {
    const values = ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'username',];
    const errorList = [];
    values.forEach(iterator => {
        if (!req.body[iterator])
            return void errorList.push(`${iterator} is Required.`);
    });
    const user = req.body;
    try {
        if (!isEmail.default(user.email))
            errorList.push(`Invalid email.`);
        if (user.password.length < 10 && passwordStrength(user.password).value.toLocaleLowerCase().includes('weak')) {
            errorList.push(`Password is too weak.`);
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).send(`Empty body!`);
    }
    if (errorList.length)
        return res.status(400).send(errorList.join('\n'));
    next();
};
const validateExpense = async (req, res, next) => {
    try {
        console.log(req.body);
        if (!req.body)
            throw new CustomError(`Empty body!`, 400);
        const values = ['title', 'amount', 'expenseDate'];
        const errorList = [];
        values.forEach(iterator => {
            if (!req.body[iterator])
                return void errorList.push(`${iterator} is Required.`);
        });
        const expense = req.body;
        if (expense.amount <= 0)
            errorList.push(`Amount must be greater than 0.`);
        if (errorList.length)
            return res.status(400).send(errorList.join('\n'));
        return next();
    }
    catch (err) {
        next(err);
    }
};
const validateIncome = async (req, res, next) => {
    try {
        if (!req.body)
            throw new CustomError(`Empty body!`, 400);
        const values = ['title', 'amount', 'incomeDate'];
        const errorList = [];
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
    }
    catch (err) {
        next(err);
    }
};
const validateCategory = async (req, res, next) => {
    try {
        if (!req.body)
            throw new CustomError(`Empty body!`, 400);
        const values = ['title'];
        const errorList = [];
        values.forEach(iterator => {
            if (!req.body[iterator])
                return void errorList.push(`${iterator} is Required.`);
        });
        if (errorList.length)
            return res.status(400).send(errorList.join('\n'));
        return next();
    }
    catch (err) {
        next(err);
    }
};
export { validateUser, validateExpense, validateIncome, validateCategory, };
//# sourceMappingURL=Validate.js.map