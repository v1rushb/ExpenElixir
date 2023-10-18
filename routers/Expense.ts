import express from 'express';
import { Expense } from '../db/entities/Expense.js';
import { addUserExpense, deleteAllExpenses, deleteExpense, deleteUserExpense, getExpenses, getFilteredExpenses, insertExpense, totalExpenses,businessExpenses } from '../controllers/Expense.js';
import authMe from '../middlewares/Auth.js';
import { Users } from '../db/entities/Users.js';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import uImage from '../utils/uploadS3Image.js';
import exp from 'constants';
import premiumAuth from '../middlewares/PremiumAuth.js';
import { Response } from 'express-serve-static-core';

const router = express.Router();

router.post('/', authMe, uImage('expen-elixir-bucket').single('expenImage'), async (req, res, next) => {
    insertExpense(req.body, req, req.file as Express.MulterS3.File).then(expense => {
        logger.info(`User ${req.body.username} added a new Expense!`);
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => next(err));
});

router.get('/', authMe, async (req, res, next) => {
    getExpenses(req, res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});

router.get('/search', authMe, async (req, res, next) => {
    getFilteredExpenses(req, res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});

router.get('/total', authMe, async (req, res, next) => {
    totalExpenses(req).then(expense => {
        logger.info(`User ${req.body.username} requested total Expenses!`);
        res.status(200).send(`Total expense : ${expense}`);
    }).catch(err => next(err));
});


router.delete('/deleteAllExpenses', authMe, async (req, res, next) => {
    deleteAllExpenses(req).then(expense => {
        res.status(200).send(`You have successfully deleted all expenses!`);
    }).catch(err => next(err));
});

router.delete('/deleteExpense/:id', authMe, async (req, res, next) => {
    deleteExpense(req.params.id, req).then(expense => {
        logger.info(`User ${req.body.username} deleted expense ${req.params.id}!`);
        res.status(200).send(`You have successfully deleted the expense with id: ${req.params.id}!`);
    }).catch(err => next(err));
});

router.get('/all',authMe,async(req,res,next)=>{ // testing purposes
    const expenses = await Expense.find();
    res.status(200).send(expenses);
});

//this is not the final code.
router.get('/businessExpenses',authMe, premiumAuth, async (req, res, next) => {
    businessExpenses(res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});

router.post('/addUserExpense', authMe, uImage('expen-elixir-bucket').single('expenImage'), async (req, res, next) => {
    addUserExpense(req.body,req.query.userID as string, res, req.file as Express.MulterS3.File).then(expense => {
        logger.info(`User ${req.body.username} added a new Expense!`);
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => next(err));
});

router.delete('/deleteUserExpense', authMe, async (req, res, next) => {
    deleteUserExpense(req.query.expenseID as string,req.query.userID as string,res).then(expense => {
        logger.info(`User ${req.body.username} deleted expense ${req.params.id}!`);
        res.status(200).send(`You have successfully deleted the expense with id: ${req.params.id}!`);
    }).catch(err => next(err));
});
export default router;