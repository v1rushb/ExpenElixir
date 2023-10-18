import express from 'express';
import { deleteAllCategory, deleteCategory, insertCategory, totalCategory } from '../controllers/Category.js';
import authMe from '../middlewares/Auth.js';
import logger from '../logger.js';
import businessCategory from '../middlewares/businessCategory.js';

const router = express.Router();

router.post('/', authMe, async (req, res, next) => {
    insertCategory(req.body, req).then(category => {
        res.status(200).send(`You have successfully added a new category!`);
    }).catch(err => next(err));
});

router.get('/', authMe, async (req, res, next) => {
    await totalCategory(req).then(category => {
        logger.info(`User ${req.body.username} requested all categorys!`);
        res.status(200).send(category);
    }).catch(err => next(err));
});

router.delete('/deleteAllCategorys', authMe, async (req, res, next) => {
    deleteAllCategory(req).then(category => {
        res.status(200).send(`You have successfully deleted all categorys!`);
    }).catch(err => next(err));
});

router.delete('/deleteCategory/:id', authMe, async (req, res, next) => {
    await deleteCategory(req.params.id).then(category => {
        logger.info(`User ${req.body.username} deleted category ${req.params.id}!`);
        res.status(200).send(`You have successfully deleted the category with id: ${req.params.id}!`);
    }).catch(err => next(err))
});

router.use('/business', businessCategory);

export default router;