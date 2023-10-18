import express from 'express';
import { Income } from '../db/entities/Income.js';
import { addUserIncome, businessIncome, deleteAllIncomes, deleteIncome, deleteUserIncome, insertIncome, totalIncomes } from '../controllers/Income.js';
import authMe from '../middlewares/Auth.js';
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import logger from '../logger.js';
import premiumAuth from '../middlewares/PremiumAuth.js';


const router = express.Router();

router.post('/', authMe, async (req, res,next) => {
    insertIncome(req.body, res).then(() => {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err=> next(err));
});
router.get('/total', authMe, async (req,res,next) => {
    totalIncomes(req).then(income => {
        logger.info(`Total income : ${income}, user: ${req.cookies["token"]}`)
        res.status(200).send(`Total income : ${income}`);
    }).catch(err=> next(err));
});


router.get('/', authMe, async (req, res,next) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        const incomes = await Users.findOne({
            where: { id: decode?.id }
        });
        res.status(200).send(incomes?.incomes);
    } catch (err) {
        next(err)
    }
});


router.delete('/deleteAllIncomes', authMe, async (req, res,next) => {
    deleteAllIncomes(req).then(income => {
        res.status(200).send(`You have successfully deleted all incomes!`);
    }).catch(err => next(err));
});

router.delete('/', authMe, async (req, res,next) => {
    deleteIncome(req.query.id as string,req).then(income => {
        logger.info(`User ${income} ${req.params.id} ` )
        res.status(200).send(`You have successfully deleted the income with id: ${req.params.id}!`);
    }).catch(err => next(err));
});

router.post('/addUserIncome', authMe, premiumAuth, async (req,res,next) => {
    addUserIncome(req.body,req.query.id as string,res).then(()=> {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err => next(err));
});

router.delete('/deleteUserIncome', authMe, premiumAuth, async (req,res,next) => {
    deleteUserIncome(req.query.id as string,req.query.userID as string,res).then(()=> {
        logger.info(`User ${res.locals.user.username} deleted income ${req.params.id} for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully deleted the income with id: ${req.params.id} for the user with id: ${req.query.userID}!`);
    }).catch(err=> next(err));
});

router.get('/IncomesUnderRootUser',authMe, premiumAuth, async (req, res, next) => {
    try {
        const users = await Users.find({ where: { business: res.locals.user.business } }) as Users[];
        const result = users.flatMap(user => user.categories.map(category => ({ ...category, userId: user.id })));
        logger.info(`User ${res.locals.user.username} requested all categories under his business!`);
        res.status(200).send(result);
    } catch(err) {
        next(err);
    }
});

router.get('/businessIncome',authMe, premiumAuth, async (req, res, next) => {
    businessIncome(res).then(income => {
        logger.info(`User ${res.locals.user.username} requested all Incomes!`);
        res.status(200).send(income);
    }).catch(err => next(err));
});

export default router;