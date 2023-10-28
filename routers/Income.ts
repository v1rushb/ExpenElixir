import express from 'express';
import { deleteAllIncomes, deleteIncome, getIncome, insertIncome, modifyIncome, totalIncomes } from '../controllers/Income.js';
import authMe from '../middlewares/Auth.js';
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import logger from '../logger.js';
import incomeBusiness from '../middlewares/businessIncome.js';
import { validateIncome } from '../middlewares/Validate.js';
import { Gen } from '../@types/generic.js';


const router = express.Router();


router.post('/', authMe, validateIncome, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    insertIncome(req.body, res).then(() => {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err => next(err));
});

router.get('/total', authMe, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    totalIncomes(res).then(income => {
        logger.info(`Total income : ${income}, user: ${req.cookies["token"]}`)
        res.status(200).send(`Total income : ${income} ${res.locals.user.profile.Currency}`);
    }).catch(err => next(err));
});


router.get('/', authMe, async (req, res, next) => {
    getIncome(req, res).then(income => {
        logger.info(`User ${req.body.username} requested all Income!`);
        res.status(200).send(income);
    }).catch((err: any) => next(err));
});


router.delete('/all-incomes', authMe, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    deleteAllIncomes(res).then(() => {
        res.status(200).send(`You have successfully deleted all incomes!`);
    }).catch(err => next(err));
});

router.delete('/:id', authMe, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    deleteIncome({ id: req.params.id }, res).then(income => {
        logger.info(`User ${res.locals.user}} has deleted income ${income} with id [${req.params.id}]`)
        res.status(200).send(`You have successfully deleted the income with id [${req.params.id}]!`);
    }).catch(err => next(err));
});

router.put('/:id', authMe, validateIncome, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    modifyIncome({ id: req.params.id, ...req.body }, res).then(income => {
        logger.info(`User ${income} ${req.params.id} `)
        res.status(200).send(`You have successfully modified your income.`);
    }).catch(err => next(err));
});

router.use('/business', incomeBusiness);

export default router;