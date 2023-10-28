import express from 'express';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';

const IAMAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {

        

        if (!res.locals.user?.business) 
            return next();
    
        const rootUserID = res.locals.user.business.rootUserID;
    
        if (!rootUserID) throw new CustomError('Root User ID not found', 401);
    
        const rootUser = await Users.findOne({ where: { id: rootUserID } });
    
        if (!rootUser || rootUser.profile?.role !== 'Root') {
          throw new CustomError('You are not authorized here!', 401);
        }
    
        next();
    } catch(err) {
        next(err);
    }
}

export default IAMAuth;