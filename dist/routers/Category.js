import express from 'express';
import { deleteAllCategory, deleteCategory, insertCategory } from '../controllers/Category.js';
import authMe from '../middlewares/Auth.js';
import { Users } from '../db/entities/Users.js';
import jwt from 'jsonwebtoken';
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
        const decode = jwt.decode(req.cookies["token"], { json: true });
        console.log(decode?.id);
        const category = await Users.findOne({
            where: { id: decode?.id }
        });
        res.status(200).send(category?.categories);
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
//# sourceMappingURL=Category.js.map