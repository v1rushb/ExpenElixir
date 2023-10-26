import express from 'express';
import authMe from '../middlewares/Auth.js';
import { getFilteredExpenses } from '../controllers/Expense.js';
import logger from '../logger.js';

const router = express.Router();

router.get('/', authMe, async (req, res, next) => {
    getFilteredExpenses(req.query.search as string, req.query.minAmount as string, req.query.maxAmount as string, req.query.category as string, req, res).then(expense => {
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});

export default router;