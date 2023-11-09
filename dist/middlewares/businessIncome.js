import express from 'express';
import authMe from './Auth.js';
import premiumAuth from './PremiumAuth.js';
import { addUserIncome, businessIncome, deleteUserIncome } from '../controllers/Business.js';
import logger from '../logger.js';
import { validateIncome } from './Validate.js';
import { modifyIncome } from '../controllers/Income.js';
const router = express.Router();
router.post('/add-user-income/:id', authMe, premiumAuth, validateIncome, async (req, res, next) => {
    addUserIncome(req.body, req.params.id, res).then(() => {
        logger.info(`${res.locals.user.username} has added an income to their business!`);
        res.status(201).send(`You have successfully added a new income!`);
    }).catch(err => next(err));
});
router.delete('/delete-user-income/:id', authMe, premiumAuth, async (req, res, next) => {
    deleteUserIncome(req.params.id, req.body.userid, res).then(() => {
        logger.info(`User ${res.locals.user.username} deleted income ${req.params.id} for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully deleted the income!`);
    }).catch(err => next(err));
});
router.get('/', authMe, premiumAuth, async (req, res, next) => {
    businessIncome(res).then(income => {
        logger.info(`${res.locals.user.username} requested all Incomes under their business!`);
        res.status(200).send(income);
    }).catch(err => next(err));
});
router.put('/:id', authMe, premiumAuth, validateIncome, async (req, res, next) => {
    modifyIncome({ ...req.body, id: req.params.id }, res).then(() => {
        logger.info(`${res.locals.user.username} has modified income ${req.params.id}!`);
        res.status(200).send(`You have successfully modified the income!`);
    }).catch(err => next(err));
});
export default router;
//# sourceMappingURL=businessIncome.js.map