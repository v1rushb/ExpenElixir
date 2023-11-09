import express from 'express'
import { Gen } from '../@types/generic.js'

const makeCardsMiddleware = (req: express.Request,res: express.Response,next: express.NextFunction) => {
    const cards: Gen.card[] = [
        {
            cardName: '${res.locals.profile.firstName} ${res.locals.profile.lastName}',
            cardNumber: 4242424242424242,
            card_token: 'tok_visa',
            cardExp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            card_cvc: 123,
            amount: 10000.63,
        },
        {
            cardName: '${res.locals.profile.firstName} ${res.locals.profile.lastName}',
            cardNumber: 4242424242424242,
            card_token: 'tok_visa',
            cardExp: new Date(Date.now() + 5 * 60 * 1000),
            card_cvc: 123,
            amount: 15.23
        },
        {
            cardName: '${res.locals.profile.firstName} ${res.locals.profile.lastName}',
            cardNumber: 4242424242424242,
            card_token: 'tok_visa',
            cardExp: new Date(Date.now() + 1 * 60 * 60 * 1000),
            card_cvc: 123,
            amount: 10000.72,
        }
    ];

    res.locals.cards = cards;
    next();
}

export default makeCardsMiddleware;