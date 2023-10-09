import express from 'express';
import { Income } from '../db/entities/Income.js';
import { deleteAllIncomes, deleteIncome, insertIncome } from '../controllers/Income.js';
import authMe from '../middlewares/Auth.js';

const router = express.Router();

router.post('/addIncome', authMe, async (req, res) => {
    insertIncome(req.body, req).then(income => {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to add a new income. error: ${err}`);
    });
});

router.get('/', authMe, async (req, res) => {
    try {
        const incomes = await Income.find();
        res.status(200).send(incomes);
    } catch (err) {
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

router.delete('/deleteIncome/:id', authMe, async (req, res) => {
    try {
        const id = req.params.id
        await deleteIncome(id);
        res.status(200).send(`You have successfully deleted the income with id: ${id}!`);
    } catch (err) {
        res.status(500).send(err);
    }
});

export default router;