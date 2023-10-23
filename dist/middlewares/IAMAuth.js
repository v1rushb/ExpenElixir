import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';
const IAMAuth = async (req, res, next) => {
    try {
        const rootUserID = res.locals.user.business.rootUserID;
        console.log(rootUserID);
        const rootUser = await Users.findOne({ where: { id: rootUserID } });
        if (rootUser?.profile.role !== 'Root') {
            throw new CustomError('You are not authorized here!', 401);
        }
    }
    catch (err) {
        next(err);
    }
};
export default IAMAuth;
//# sourceMappingURL=IAMAuth.js.map