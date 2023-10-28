import express from 'express';
import authMe from './Auth.js';
import premiumAuth from './PremiumAuth.js';
import { addUserExpense, businessExpenses, deleteUserExpense } from '../controllers/Business.js';
import logger from '../logger.js';
import uImage from '../utils/uploadS3Image.js';
import checkBusiness from './business-check.js';
import { getFilteredExpenses } from '../controllers/Business.js';
const router = express.Router();
router.get('/business-expenses', authMe, premiumAuth, checkBusiness, async (req, res, next) => {
    businessExpenses(res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});
router.post('/add-user-expense/:id', authMe, premiumAuth, checkBusiness, uImage('expen-elixir-bucket').single('expenImage'), async (req, res, next) => {
    addUserExpense({ ...req.body, id: req.query.id, picFile: req.file }, res).then(expense => {
        logger.info(`User ${req.body.username} added a new Expense!`);
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => next(err));
});
router.delete('/delete-user-expense/:id', authMe, premiumAuth, checkBusiness, async (req, res, next) => {
    deleteUserExpense({ expenseID: req.params.id, userID: req.query.userID }, res).then(expense => {
        logger.info(`User ${req.body.username} deleted expense ${req.query.id}!`);
        res.status(200).send(`You have successfully deleted the expense!`);
    }).catch(err => next(err));
});
router.get('/search', authMe, premiumAuth, checkBusiness, async (req, res, next) => {
    const payload = {
        searchQuery: req.query.search,
        minAmountQuery: req.query.minAmount,
        maxAmountQuery: req.query.maxAmount,
        userIDQuery: req.query.userID
    };
    getFilteredExpenses(payload, req, res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});
export default router;
//# sourceMappingURL=businessExpense.js.map