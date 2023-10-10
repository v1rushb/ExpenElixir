import express from 'express';
import { Category } from '../db/entities/Category.js';
import { deleteAllCategory, deleteCategory, insertCategory } from '../controllers/Category.js';
import authMe from '../middlewares/Auth.js';
const router = express.Router();
router.post('/', authMe, async (req, res) => {
    console.log(new Date());
    insertCategory(req.body, req).then(category => {
        res.status(200).send(`You have successfully added a new category!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to add a new category. error: ${err}`);
    });
});
router.get('/', authMe, async (req, res) => {
    try {
        const categorys = await Category.find();
        res.status(200).send(categorys);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.delete('/deleteAllcategorys', authMe, async (req, res) => {
    deleteAllCategory(req).then(category => {
        res.status(200).send(`You have successfully deleted all categorys!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to delete all categorys. error: ${err}`);
    });
});
router.delete('/deletecategory/:id', authMe, async (req, res) => {
    try {
        const id = Number(req.params.id);
        await deleteCategory(id);
        res.status(200).send(`You have successfully deleted the category with id: ${id}!`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
export default router;
