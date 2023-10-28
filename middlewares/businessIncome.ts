import express from 'express';
import authMe from './Auth.js';
import premiumAuth from './PremiumAuth.js';
import { addUserIncome, businessIncome, deleteUserIncome } from '../controllers/Business.js';
import logger from '../logger.js';
import { validateIncome } from './Validate.js';
import { modifyIncome } from '../controllers/Income.js';

const router = express.Router();


router.post('/add-user-income/:id', authMe, premiumAuth, validateIncome, async (req,res,next): Promise<void> => {
    addUserIncome(req.body,req.params.id as string,res).then(()=> {
        logger.info(`User ${res.locals.user.username} added income ${req.params.id} for user with id ${req.params.id}!`);
        res.status(201).send(`You have successfully added a new income!`);
    }).catch(err => next(err));
});

router.delete('/delete-user-income/:id', authMe, premiumAuth, async (req,res,next): Promise<void> => {
    deleteUserIncome(req.params.id as string,req.body.userid as string,res).then(()=> {
        logger.info(`User ${res.locals.user.username} deleted income ${req.params.id} for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully deleted the income!`);
    }).catch(err=> next(err));
});

router.get('/',authMe, premiumAuth, async (req, res, next): Promise<void> => {
    businessIncome(res).then(income => {
        logger.info(`User ${res.locals.user.username} requested all Incomes!`);
        res.status(200).send(income);
    }).catch(err => next(err));
});

router.put('/:id',authMe, premiumAuth, validateIncome, async (req, res, next): Promise<void> => {
    modifyIncome({...req.body,id: req.params.id},res).then(()=> {
        logger.info(`User ${res.locals.user.username} modified income ${req.params.id}!`);
        res.status(200).send(`You have successfully modified the income!`);
    }).catch(err => next(err));
});

export default router;