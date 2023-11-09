import express from 'express';

import { getAdvice, getExpensesByCategory, makeGraphicalData, sortQueryByAmount, getPrediction } from '../controllers/Analytics.js';
import logger from '../logger.js';
import authMe from './Auth.js';
const router = express.Router();

router.get('/expenses-by-category', authMe, async (req, res, next): Promise<void> => {
    try {
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

router.get('/predict-me', authMe, async (req, res, next): Promise<void> => { 
    getPrediction(res).then(async data => {
        logger.info(`200 OK - /analytics/predict-me - GET - ${req.ip}`);
        res.status(200).send(data);
    }).catch(err => next(err));
});


export default router;