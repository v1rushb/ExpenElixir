import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
const authMe = async (req, res, next) => {
    try {
        const token = req.cookies["token"] || "";
        const isValidToken = jwt.verify(token, process.env.SECRET_KEY || "");
        if (isValidToken) {
            const decode = jwt.decode(token, { json: true });
            const user = await Users.findOne({
                where: { email: decode?.email }
            });
            return next();
        }
        return res.status(401).send(`Unauthorized`);
    }
    catch (err) {
        console.error(err);
        res.status(500).send(`Unexpected Error err: ${err}`);
    }
};
export default authMe;
