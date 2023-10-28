import express from 'express';
import {recommendation, getAdvice, sortRecommendation, getFireAdvice} from '../controllers/Business.js';
import { CustomError } from '../CustomError.js';
import authMe from './Auth.js';
import {ChatGPTAPI, ChatMessage} from 'chatgpt';

const router = express.Router();


router.get('/recommend-fire',async (req, res, next) => {
    recommendation(res).then(async list=> {
        if(!list.length)
            throw new CustomError('Your business currently has no signed users!',404); 
        const sortedRecommendation: {username: string, userId: string, incomeExpenseDiff: number}[] = sortRecommendation(list);
        res.status(200).send(await getFireAdvice(sortRecommendation(sortedRecommendation)));
    }).catch(err => next(err));
});

router.get('/recommend-promote', async (req, res, next) => {
    recommendation(res).then(async list=> {
        console.log(list);
        if(!list.length)
            throw new CustomError('Your business currently has no signed users!',404); 
        const sortedRecommendation: {username: string, userId: string, incomeExpenseDiff: number}[] = sortRecommendation(list);
        res.status(200).send((await getAdvice(sortedRecommendation)));
    }).catch(err => next(err));
});

export default router;