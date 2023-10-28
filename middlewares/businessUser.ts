import express from 'express';
import authMe from './Auth.js';
import PremiumAuth from './PremiumAuth.js';
import { businessBalance, businessUsers, createUserUnderRoot } from '../controllers/Business.js';
import logger from '../logger.js';
import { Business } from '../db/entities/Business.js';
import { CustomError } from '../CustomError.js';
import { validateUser } from './Validate.js';
import checkBusiness from './business-check.js';

const router = express.Router();

router.post('/add-user', authMe, PremiumAuth, checkBusiness, validateUser, async (req, res, next): Promise<void> => {
    createUserUnderRoot(req.body, res).then(user => {
        logger.info(`201 Created - /user/addUser - POST - ${req.ip}`);
        res.status(201).send(`${user.username} has been successfully added to your busines. A verification email has been sent to ${user.email}!`);
    }).catch(err => next(err));
});

router.get('/', authMe, PremiumAuth, checkBusiness, async (req, res, next): Promise<void> => {
    businessUsers(res).then(users => {
        logger.info(`200 OK - /user/businessUsers - GET - ${req.ip}`);
        res.status(200).send(users);
    }).catch(err => next(err));
});

router.get('/balance', authMe, PremiumAuth, checkBusiness, async (req, res, next): Promise<void> => {
    businessBalance(res).then(balance => {
        logger.info(`200 OK - /user/businessBalance - GET - ${req.ip}`);
        res.status(200).send(`Your business balance is: ${balance}`);
    }).catch(err => next(err));
});

export default router;