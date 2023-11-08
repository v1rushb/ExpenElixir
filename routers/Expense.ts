import express from 'express';
import { deleteAllExpenses, deleteExpense, getExpenses, insertExpense, totalExpenses, updateExpense } from '../controllers/Expense.js';
import authMe from '../middlewares/Auth.js';
import logger from '../logger.js';
import uImage from '../utils/uploadS3Image.js';
import expenseBusiness from '../middlewares/businessExpense.js';
import { validateExpense } from '../middlewares/Validate.js';
import expenseAnalytics from '../middlewares/expense-analytics.js';
import filtering from '../middlewares/filtering.js';

const router = express.Router();


router.post('/', authMe, uImage('expen-elixir-bucket').single('expenImage'), validateExpense, async (req, res, next) => {
    insertExpense({ ...req.body, picFile: req.file as Express.MulterS3.File }, res).then(expense => {
        logger.info(`${res.locals.user.username} has added a new Expense!`);
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => next(err));
});

router.get('/', authMe, async (req, res, next) => {
    getExpenses(req, res).then(expenses => {
        logger.info(`${req.body.username} has requested all of their Expenses!`);
        res.status(200).send(expenses);
    }).catch(err => next(err));
});

router.get('/total', authMe, async (req, res, next) => {
    totalExpenses(res).then(total => {
        logger.info(`${res.locals.user.username} has requested the total amount of their Expenses' worth.`);
        res.status(200).send(`Total expenses: ${total} ${res.locals.user.profile.Currency}`);
    }).catch(err => next(err));
});


router.delete('/all-expenses', authMe, async (req, res, next) => {
    deleteAllExpenses(res).then(() => {
        logger.info(`${res.locals.user.username} has deleted all of their Expenses.`);
        res.status(200).send(`You have successfully deleted all of your Expenses!`);
    }).catch(err => next(err));
});

router.delete('/:id', authMe, async (req, res, next) => {
    deleteExpense({ id: req.params.id }).then(expense => {
        logger.info(`${res.locals.user.username} has deleted an Expense with the id [${req.params.id}]`);
        res.status(200).send(`You have successfully deleted the Expense! too much eddies?`);
    }).catch(err => next(err));
});

router.put('/:id', authMe, uImage('expen-elixir-bucket').single('expenImage'), validateExpense, async (req, res, next) => {
    updateExpense(req.params.id, { ...req.body, picFile: req.file as Express.MulterS3.File }, res).then(expense => {
        logger.info(`${res.locals.user.username} has modified an Expense with the id [${req.params.id}]`);
        res.status(200).send(`You have successfully modified the expense with id [${req.params.id}]`);
    }).catch(err => next(err));
});

router.use('/search', filtering);
router.use('/analytics', expenseAnalytics);
router.use('/business', expenseBusiness);

export default router;