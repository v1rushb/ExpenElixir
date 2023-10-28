import express from 'express';
import { sendEmail } from '../utils/sesServiceAws.js';

const checkBusiness = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    next();
    // try {
    //     const user = res.locals.user;
    //     if(user.profile.role === 'Member' || user.profile.role === 'User') 
    //         return next();
    //     const subDate = user.profile.subscription_date;
    //     const today = new Date();

    //     const arg = (today.getTime() - subDate.getTime()) / (1000 * 60);

    //     if (arg > 15) {
    //         await sendEmail(`Your subscription has expired!`, `Subscription Expired!`);
    //         user.profile.hasSentEmail = true;
    //         user.profile.role = 'Member';
    //         await user.profile.save();
    //     }
    //     next();
    // } catch (err) {
    //     next(err);
    // }
}

export default checkBusiness;