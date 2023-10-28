import express from 'express';
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';

const authMe = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.cookies["token"] || "";
        const isValidToken = jwt.verify(token, process.env.SECRET_KEY || "");

        if (isValidToken ) {
            const decode = jwt.decode(token, { json: true });
            const user = await Users.findOne({
                where: { email: decode?.email }
            })
            if(!user)
                throw new CustomError('Unauthorized', 401);
            res.locals.user = user;
            res.locals.filter = {
                skip: (Number(req.query.pageNumber || 1) - 1) * Number(req.query.pageSize || 5),
                take: Number(req.query.pageSize || 5),
            }
            return next();
        }
        throw new CustomError(`Unauthorized`, 401);
    } catch (err) {
        next(new CustomError(`Unauthorized`, 401));
    }
}

export default authMe;