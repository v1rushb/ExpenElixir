import express from 'express';
import { Income } from '../db/entities/Income.js';
import { deleteAllIncomes, deleteIncome, insertIncome, totalIncomes } from '../controllers/Income.js';
import authMe from '../middlewares/Auth.js';
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import logger from '../logger.js';


const router = express.Router();

router.post('/', authMe, async (req, res,next) => {
    insertIncome(req.body, req).then(income => {
        res.status(200).send(`You have successfully added a new income!`);
    }).catch(err=> next(err));
});
router.get('/total', authMe, async (req,res,next) => {
    totalIncomes(req).then(income => {
        logger.info(`Total income : ${income}, user: ${req.cookies["token"]}`)
        res.status(200).send(`Total income : ${income}`);
    }).catch(err=> next(err));
});


router.get('/', authMe, async (req, res,next) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        const incomes = await Users.findOne({
            where: { id: decode?.id }
        });
        res.status(200).send(incomes?.incomes);
    } catch (err) {
        next(err)
    }
});


router.delete('/deleteAllIncomes', authMe, async (req, res,next) => {
    deleteAllIncomes(req).then(income => {
        res.status(200).send(`You have successfully deleted all incomes!`);
    }).catch(err => next(err));
});

router.delete('/', authMe, async (req, res,next) => {
    deleteIncome(req.query.id as string,req).then(income => {
        logger.info(`User ${income} ${req.params.id} ` )
        res.status(200).send(`You have successfully deleted the income with id: ${req.params.id}!`);
    }).catch(err => next(err));
});

export default router;