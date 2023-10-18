import express from 'express';
import authMe from './Auth.js';
import premiumAuth from './PremiumAuth.js';
import { addUserExpense, businessExpenses, deleteUserExpense } from '../controllers/Business.js';
import logger from '../logger.js';
import uImage from '../utils/uploadS3Image.js';
import { validateExpense } from './Validate.js';
import multer from 'multer';

const router = express.Router();

router.get('/business-expenses', authMe, premiumAuth, async (req, res, next) => {
    businessExpenses(res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});

router.post('/add-user-expense', authMe, uImage('expen-elixir-bucket').single('expenImage'), async (req, res, next) => {
    addUserExpense(req.body,req.query.userID as string, res, req.file as Express.MulterS3.File).then(expense => {
        logger.info(`User ${req.body.username} added a new Expense!`);
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => next(err));
});

router.delete('/delete-user-expense', authMe, async (req, res, next) => {
    deleteUserExpense(req.query.expenseID as string,req.query.userID as string,res).then(expense => {
        logger.info(`User ${req.body.username} deleted expense ${req.query.id}!`);
        res.status(200).send(`You have successfully deleted the expense!`);
    }).catch(err => next(err));
});

export default router;