import express from 'express';
import authMe from '../middlewares/Auth.js';
import { getFilteredExpenses } from '../controllers/Expense.js';
import logger from '../logger.js';
const router = express.Router();
router.get('/', authMe, async (req, res, next) => {
    const { query } = req;
    const payload = {
        searchQuery: query.search,
        minAmountQuery: query.minAmount,
        maxAmountQuery: query.maxAmount,
        category: query.category,
    };
    getFilteredExpenses(payload, req, res).then(expense => {
        logger.info(`${res.locals.user.username} has requested filtered Expenses according to the following query: ${JSON.stringify(payload)}`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});
export default router;
//# sourceMappingURL=filtering.js.map