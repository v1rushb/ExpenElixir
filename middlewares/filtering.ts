import express from 'express';
import authMe from '../middlewares/Auth.js';
import { getFilteredExpenses } from '../controllers/Expense.js';
import logger from '../logger.js';
import { Gen } from '../@types/generic.js';

const router = express.Router();

router.get('/', authMe, async (req, res, next) => {
    const { query } = req;
    const payload: Gen.getFilteredExpenses = {
        searchQuery: query.search as string,
        minAmountQuery: query.minAmount as string,
        maxAmountQuery: query.maxAmount as string,
        category: query.category as string,
    };
    getFilteredExpenses(payload, req, res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});

export default router;