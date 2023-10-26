import express from 'express';
import { sendEmail } from '../utils/sesServiceAws.js';

const checkBusiness = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user = res.locals.user;
        const subDate = user.profile.subscription_date;
        const today = new Date();

        const arg = today.getTime() - subDate.getTime()/(1000*60);

        if(arg > 15)
        {
            await sendEmail(`Your subscription has expired!`, `Subscription Expired!`);
            user.profile.hasSentEmail = true;
            user.profile.role = 'User';
            await user.profile.save();
        }
        next();
    } catch(err) {
        next(err);
    }
}

export default checkBusiness;