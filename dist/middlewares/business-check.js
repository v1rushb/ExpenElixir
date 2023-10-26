const checkBusiness = async (req, res, next) => {
    try {
        const user = res.locals.user;
        const subDate = user.profile.subscription_date;
        const today = new Date();
        const arg = today.getTime() - subDate.getTime() / (1000 * 60);
        if (arg > 15) {
<<<<<<< HEAD
            await sendEmail(`Your subscription has expired!`, `Subscription Expired!`);
=======
            //    await sendEmail(user.email,`Your subscription has expired!`, `Subscription Expired!`);
>>>>>>> cb0ba2cd9df643339156b91aebbf2ed32f3b63cd
            user.profile.hasSentEmail = true;
            user.profile.role = 'User';
            await user.profile.save();
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
export default checkBusiness;
//# sourceMappingURL=business-check.js.map