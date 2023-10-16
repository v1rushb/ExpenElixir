import express from 'express';
import { decodeToken } from '../controllers/Income.js';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';

const premiumAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user = res.locals.user;
        console.log(user.profile);
        if (!user) 
            throw new CustomError('User not found', 404);

        if(user.profile.role !== 'Root') 
            throw new CustomError('You are not a root user', 401);
        return next();
    }
    catch(err) {
        return next(err);
    }
}

export default premiumAuth;