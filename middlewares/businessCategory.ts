import express from 'express';
import authMe from './Auth.js';
import { addUserCategory, businessCategories, deleteUserCategory, modifyUserCategory } from '../controllers/Business.js';
import logger from '../logger.js';
import premiumAuth from './PremiumAuth.js';
import { validateCategory } from './Validate.js';

const router = express.Router();

router.get('/business-categories', authMe, premiumAuth, async (req, res, next): Promise<void> => { // testing purposes
    businessCategories(res).then(categories => {
        logger.info(`User ${req.body.username} requested all categories!`);
        res.status(200).send(categories);
    }).catch(err => next(err));
});

router.delete('/delete-user-category', authMe, premiumAuth, async (req, res, next): Promise<void> => {
    deleteUserCategory(req.query.id as string, req.query.userID as string, res).then(() => {
        logger.info(`User ${res.locals.user.username} deleted category ${req.params.id} for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully deleted the category with id: ${req.params.id}!`);
    }).catch(err => next(err));
});

router.post('add-user-category', authMe, premiumAuth, validateCategory, async (req, res, next): Promise<void> => {
    addUserCategory(req.body, req.query.userID as string, res).then(() => {
        logger.info(`User ${res.locals.user.username} added a new category for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully added a new category!`);
    }).catch(err => next(err));
});

router.put('/modify', authMe, premiumAuth, validateCategory, async (req, res, next): Promise<void> => {
    modifyUserCategory(req.query.id as string, req.query.userID as string, req.body, res).then(() => {
        logger.info(`User ${res.locals.user.username} modified category ${req.params.id} for user with id ${req.query.userID}!`);
        res.status(200).send(`You have successfully modified the category!`);
    }).catch(err => next(err));
});

export default router;
