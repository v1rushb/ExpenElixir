import express from 'express';
import authMe from './Auth.js';
import premiumAuth from './PremiumAuth.js';
import { addUserIncome, businessIncome, deleteUserIncome } from '../controllers/Business.js';
import logger from '../logger.js';
import { Users } from '../db/entities/Users.js';

const router = express.Router();


router.post('/add-user-income', authMe, premiumAuth, async (req,res,next) => {
    addUserIncome(req.body,req.query.id as string,res).then(()=> {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err => next(err));
});

router.delete('/delete-user-income', authMe, premiumAuth, async (req,res,next) => {
    deleteUserIncome(req.query.id as string,req.query.userID as string,res).then(()=> {
        logger.info(`User ${res.locals.user.username} deleted income ${req.params.id} for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully deleted the income with id: ${req.params.id} for the user with id: ${req.query.userID}!`);
    }).catch(err=> next(err));
});

router.get('/business-income',authMe, premiumAuth, async (req, res, next) => {
    businessIncome(res).then(income => {
        logger.info(`User ${res.locals.user.username} requested all Incomes!`);
        res.status(200).send(income);
    }).catch(err => next(err));
});

export default router;