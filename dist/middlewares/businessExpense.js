import express from 'express';
import authMe from './Auth.js';
import premiumAuth from './PremiumAuth.js';
import { addUserExpense, businessExpenses, deleteUserExpense } from '../controllers/Business.js';
import logger from '../logger.js';
import uImage from '../utils/uploadS3Image.js';
import { validateExpense } from './Validate.js';
import { getFilteredExpenses } from '../controllers/Business.js';
import expenseAnalytics from '../middlewares/business-analytics.js';
const router = express.Router();
router.get('/', authMe, premiumAuth, async (req, res, next) => {
    businessExpenses(res).then(expense => {
        logger.info(`${res.locals.user.username} has requested all of their business's Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});
router.post('/:id', authMe, premiumAuth, validateExpense, uImage('expen-elixir-bucket').single('expenImage'), async (req, res, next) => {
    addUserExpense({ ...req.body, id: req.query.id, picFile: req.file }, res).then(expense => {
        logger.info(`User ${res.locals.user.username} added a new Expense to their business!`);
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => next(err));
});
router.delete('/:id', authMe, premiumAuth, async (req, res, next) => {
    deleteUserExpense({ expenseID: req.params.id, userID: req.body.userID }, res).then(expense => {
        logger.info(`User ${res.locals.user.username} has deleted an expense with the id [${req.params.id}]`);
        res.status(200).send(`You have successfully deleted the expense!`);
    }).catch(err => next(err));
});
router.get('/search', authMe, premiumAuth, async (req, res, next) => {
    const payload = {
        searchQuery: req.query.search,
        minAmountQuery: req.query.minAmount,
        maxAmountQuery: req.query.maxAmount,
        userIDQuery: req.query.userID
    };
    getFilteredExpenses(payload, req, res).then(expense => {
        logger.info(`User ${res.locals.user.username} has requested all Expenses according to the following query: ${JSON.stringify(payload)}`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});
router.use('/analytics', authMe, premiumAuth, expenseAnalytics);
export default router;
//# sourceMappingURL=businessExpense.js.map