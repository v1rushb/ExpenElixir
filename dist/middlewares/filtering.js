import express from 'express';
import authMe from '../middlewares/Auth.js';
import { getFilteredExpenses } from '../controllers/Expense.js';
import logger from '../logger.js';
const router = express.Router();
router.get('/', authMe, async (req, res, next) => {
<<<<<<< HEAD
    getFilteredExpenses(req.query.search, req.query.minAmount, req.query.maxAmount, req, res).then(expense => {
=======
    getFilteredExpenses(req.query.search, req.query.minAmount, req.query.maxAmount, req.query.category, req, res).then(expense => {
>>>>>>> cb0ba2cd9df643339156b91aebbf2ed32f3b63cd
        logger.info(`User ${req.body.username} requested all Expenses!`);
        res.status(200).send(expense);
    }).catch(err => next(err));
});
export default router;
//# sourceMappingURL=filtering.js.map