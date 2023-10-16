import { CustomError } from '../CustomError.js';
const premiumAuth = async (req, res, next) => {
    try {
        const user = res.locals.user;
        console.log(user.profile);
        if (!user)
            throw new CustomError('User not found', 404);
        if (user.profile.role !== 'Root')
            throw new CustomError('You are not a root user', 401);
        return next();
    }
    catch (err) {
        return next(err);
    }
};
export default premiumAuth;
//# sourceMappingURL=PremiumAuth.js.map