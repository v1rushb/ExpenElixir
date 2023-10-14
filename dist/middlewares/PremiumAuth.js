import { CustomError } from '../CustomError.js';
const premiumAuth = async (req, res, next) => {
    try {
        const user = res.locals.user;
        console.log(user);
        if (!user)
            throw new CustomError('User not found', 404);
        if (user.profile.subscription !== 'premium')
            throw new CustomError('You are not a premium user', 401);
        return next();
    }
    catch (err) {
        return next(err);
    }
};
export default premiumAuth;
//# sourceMappingURL=PremiumAuth.js.map