import express from 'express';
import { CustomError } from '../CustomError.js';
import { getAdvice, getExpensesByCategory, isValidDate, makeGraphicalData, sortQueryByAmount } from '../controllers/Analytics.js';
import logger from '../logger.js';
import authMe from './Auth.js';

const router = express.Router();

router.get('/expenses-by-category', authMe, async (req, res, next) => { // time consuming ;O
    try {
        // const {startDate, endDate} = req.query;
        const startDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
        const endDate = new Date(Date.now());
        if(!startDate || !endDate)
            throw new CustomError(`Please provide a start date and an end date.`, 400);

        if(!isValidDate(startDate.toString()) || !isValidDate(endDate.toString()))
            throw new CustomError(`Please provide valid start and end dates.`, 400);

        getExpensesByCategory(res).then(async data => {
            logger.info(`200 OK - /analytics/expenses-by-category - GET - ${req.ip}`);
            const info = makeGraphicalData(sortQueryByAmount(data));
            const getAdviceinfo = await getAdvice(info);
            res.status(200).send(info + `\n \n ${getAdviceinfo}`);
        }).catch(err => next(err));
    } catch (err) {
        next(err);
    }
});


export default router;