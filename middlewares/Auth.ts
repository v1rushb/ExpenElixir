import express from 'express';
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { CustomError } from '../CustomError.js';

const authMe = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.cookies["token"] || "";
        const isValidToken = jwt.verify(token, process.env.SECRET_KEY || "");

        if (isValidToken) {
            const decode = jwt.decode(token, { json: true });
            const user = await Users.findOne({
                where: { email: decode?.email }
            })
            return next();
        }
        throw new CustomError(`Unauthorized`, 401);
    } catch (err) {
        console.error(err);
        if (err instanceof CustomError)
            return res.status(err.statusCode).send(err.message);
        res.status(500).send(`Unexpected Error err: ${err}`);
    }
}

export default authMe;