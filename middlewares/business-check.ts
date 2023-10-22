import express from 'express';

const checkBusiness = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = res.locals.user;
    const subDate = user.profile.subscription_date;
    const today = new Date();

    const arg = today.getTime() - subDate.getTime()/(1000*60);

    if(arg > 15)
    {
        //do the ses thingy here and take out the business role
        user.profile.role = 'User';
        await user.profile.save();
    }
    next();
}

export default checkBusiness;