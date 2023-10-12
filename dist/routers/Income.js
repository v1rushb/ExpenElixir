import express from 'express';
import { deleteAllIncomes, deleteIncome, insertIncome, totalIncomes } from '../controllers/Income.js';
import authMe from '../middlewares/Auth.js';
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
const router = express.Router();
router.post('/', authMe, async (req, res) => {
    console.log(new Date());
    insertIncome(req.body, req).then(income => {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to add a new income. error: ${err}`);
    });
});
router.get('/total', authMe, async (req, res) => {
    try {
        res.status(200).send(`Total income : ${await totalIncomes(req)}`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.get('/', authMe, async (req, res) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        console.log(decode?.id);
        const incomes = await Users.findOne({
            where: { id: decode?.id }
        });
        res.status(200).send(incomes?.incomes);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.delete('/deleteAllIncomes', authMe, async (req, res) => {
    deleteAllIncomes(req).then(income => {
        res.status(200).send(`You have successfully deleted all incomes!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to delete all incomes. error: ${err}`);
    });
});
router.delete('/:id', authMe, async (req, res) => {
    try {
        const id = req.params.id;
        await deleteIncome(id);
        res.status(200).send(`You have successfully deleted the income with id: ${id}!`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
export default router;
//# sourceMappingURL=Income.js.map