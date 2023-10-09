import express from 'express';
import { Expense } from '../db/entities/Expense.js';
import { deleteAllExpenses, deleteExpense as deleteExpense, insertExpense } from '../controllers/Expense.js';
import authMe from '../middlewares/Auth.js';

const router = express.Router();

router.post('/addExpense', authMe, async (req, res) => {
    insertExpense(req.body, req).then(expense => {
        res.status(200).send(`You have successfully added a new Expense!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to add a new Expense. error: ${err}`);
    });
});

router.get('/', authMe, async (req, res) => {
    try {
        const expense = await Expense.find();
        res.status(200).send(expense);
    } catch (err) {
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
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;