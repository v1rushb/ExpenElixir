import express from 'express';
import { deleteAllCategories, deleteCategory, insertCategory, totalCategory, modifyCategory } from '../controllers/Category.js';
import authMe from '../middlewares/Auth.js';
import logger from '../logger.js';
import businessCategory from '../middlewares/businessCategory.js';
import { validateCategory } from '../middlewares/Validate.js';
const router = express.Router();
router.post('/', authMe, validateCategory, async (req, res, next) => {
    insertCategory(req.body, res).then(category => {
        logger.info(`${res.locals.user.username} has added a new category.`);
        res.status(200).send(`You have successfully added a new category!`);
    }).catch(err => next(err));
});
router.get('/', authMe, async (req, res, next) => {
    totalCategory(res).then(category => {
        logger.info(`${res.locals.user.username} requested all of their categories.`);
        res.status(200).send(category);
    }).catch(err => next(err));
});
router.delete('/all-categories', authMe, async (req, res, next) => {
    deleteAllCategories(res).then(category => {
        logger.info(`${req.body.username} has deleted all of their categories.`);
        res.status(200).send(`You have successfully deleted all of your categories!`);
    }).catch(err => next(err));
});
router.delete('/:id', authMe, async (req, res, next) => {
    await deleteCategory({ id: req.params.id }).then(category => {
        logger.info(`${res.locals.user.username} has deleted a category with the id [${req.params.id}]`);
        res.status(200).send(`You have successfully deleted the category!`);
    }).catch(err => next(err));
});
router.put('/:id', authMe, validateCategory, async (req, res, next) => {
    modifyCategory({ id: req.params.id, ...req.body }, res).then(() => {
        logger.info(`${res.locals.user.username} has modified the category with the id [${req.params.id}]`);
        res.status(200).send(`You have successfully modified the category!`);
    }).catch(err => next(err));
});
router.use('/business', businessCategory);
export default router;
//# sourceMappingURL=Category.js.map