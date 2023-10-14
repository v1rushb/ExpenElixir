import express from 'express';
import { decodeToken } from '../controllers/Income.js';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';

const premiumAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user = res.locals.user;
        console.log(user);
        if (!user) 
            throw new CustomError('User not found', 404);

        if(user.profile.subscription !== 'premium') 
            throw new CustomError('You are not a premium user', 401);
        return next();
    }
    catch(err) {
        return next(err);
    }
}

export default premiumAuth;