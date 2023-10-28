import express from 'express';
import { deleteAllIncomes, deleteIncome, insertIncome, modifyIncome, totalIncomes } from '../controllers/Income.js';
import authMe from '../middlewares/Auth.js';
import { Users } from '../db/entities/Users.js';
import logger from '../logger.js';
import incomeBusiness from '../middlewares/businessIncome.js';
import { validateIncome } from '../middlewares/Validate.js';
const router = express.Router();
router.post('/', authMe, validateIncome, async (req, res, next) => {
    insertIncome(req.body, res).then(() => {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err => next(err));
});
router.get('/total', authMe, async (req, res, next) => {
    totalIncomes(res).then(income => {
        logger.info(`Total income : ${income}, user: ${req.cookies["token"]}`);
        res.status(200).send(`Total income : ${income} ${res.locals.user.profile.currency}`);
    }).catch(err => next(err));
});
router.get('/', authMe, async (req, res, next) => {
    try {
        const incomes = await Users.findOne({
            where: { id: res.locals.user.id }
        });
        res.status(200).send(incomes?.incomes);
    }
    catch (err) {
        next(err);
    }
});
router.delete('/all-incomes', authMe, async (req, res, next) => {
    deleteAllIncomes(res).then(() => {
        res.status(200).send(`You have successfully deleted all incomes!`);
    }).catch(err => next(err));
});
router.delete('/:id', authMe, async (req, res, next) => {
    deleteIncome({ id: req.params.id }, res).then(income => {
        logger.info(`User ${res.locals.user}} has deleted income ${income} with id [${req.params.id}]`);
        res.status(200).send(`You have successfully deleted the income with id [${req.params.id}]!`);
    }).catch(err => next(err));
});
router.put('/:id', authMe, validateIncome, async (req, res, next) => {
    modifyIncome({ id: req.params.id, ...req.body }, res).then(income => {
        logger.info(`User ${income} ${req.params.id} `);
        res.status(200).send(`You have successfully modified your income.`);
    }).catch(err => next(err));
});
router.use('/business', incomeBusiness);
export default router;
//# sourceMappingURL=Income.js.map