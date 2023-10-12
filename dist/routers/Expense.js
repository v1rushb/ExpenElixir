import express from 'express';
import { deleteAllExpenses, deleteExpense, insertExpense, totalExpenses } from '../controllers/Expense.js';
import authMe from '../middlewares/Auth.js';
import { Users } from '../db/entities/Users.js';
import jwt from 'jsonwebtoken';
const router = express.Router();
router.post('/', authMe, async (req, res) => {
    insertExpense(req.body, req).then(expense => {
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to add a new Expense. error: ${err}`);
    });
});
router.get('/', authMe, async (req, res) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        console.log(decode?.id);
        const expense = await Users.findOne({
            where: { id: decode?.id }
        });
        res.status(200).send(expense?.expenses);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.get('/total', authMe, async (req, res) => {
    try {
        res.status(200).send(`Total expense : ${await totalExpenses(req)}`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.delete('/deleteAllExpenses', authMe, async (req, res) => {
    deleteAllExpenses(req).then(expense => {
        res.status(200).send(`You have successfully deleted all expenses!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to delete all expenses. error: ${err}`);
    });
});
router.delete('/deleteExpense/:id', authMe, async (req, res) => {
    try {
        const id = req.params.id;
        await deleteExpense(id);
        res.status(200).send(`You have successfully deleted the Expense with id: ${id}!`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
export default router;
//# sourceMappingURL=Expense.js.map