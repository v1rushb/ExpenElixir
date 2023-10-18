import express from 'express';
import { Users } from '../db/entities/Users.js';
import { businessBalance, businessUsers, calculateBalance, createUserUnderRoot, insertUser, login } from '../controllers/User.js';
import authMe from '../middlewares/Auth.js';
import { validateUser } from '../middlewares/Validate.js';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import { CustomError } from '../CustomError.js';
import PremiumAuth from '../middlewares/PremiumAuth.js';
import { Business } from '../db/entities/Business.js';

const router = express.Router();

//registering a new user using the insertUser function from the User controller.
//ps: do the the error handling thingy whenever you can. (mid priority)

router.post('/register', validateUser, async (req, res, next) => {
    insertUser(req.body).then(user => {
        logger.info(`201 Created - /user/register - POST - ${req.ip}`);
        res.status(201).send(`You have been registered successfully ${user.username}!`);
    }).catch(err => next(err));
});


router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const token = req.cookies["token"];
    try {
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY || '');
            return res.status(400).send(`You are already logged in.`);
        }
    } catch (err) {
        return next(new CustomError(`Your session has expired or is invalid. Please log in again.`, 400));
    }

    if (email && password) {
        login(email, password).then(data => {
            res.cookie("userEmail", data.email, { maxAge: 30 * 60 * 1000 });
            res.cookie("token", data.token, { maxAge: 30 * 60 * 1000 });
            res.cookie("loginDate", Date.now(), { maxAge: 30 * 60 * 1000 });

            logger.info(`200 OK - /user/login - POST - ${req.ip}`);
            res.status(200).send(`You have successfully logged in ${data.username}!`);
        }).catch(err => next(err));
    }
    else {
        return next({ message: `Invalid email or password.`, code: 401 });
    }
});

router.post('/logout', (req, res) => {
    const token = req.cookies["token"];


    if (!token) {
        throw new CustomError(`You are not logged in.`, 401);
    }

    try {
        jwt.verify(token, process.env.SECRET_KEY || '');
        const decoded = jwt.decode(token || '', { json: true });

        res.clearCookie("userEmail");
        res.clearCookie("token");
        res.clearCookie("loginDate");
        logger.info(`200 OK - /user/logout - POST - ${req.ip}`);
        res.status(200).send(`You have been logged out. See you soon ${decoded?.username}!`);
    } catch (err) {
        throw new CustomError(`Your session has expired or is invalid. Please log in again.`, 400);
    }
});

router.get('/balance', authMe, async (req, res, next) => {
    calculateBalance(req).then(data => {
        logger.info(`200 OK - /user/totalIncome - GET - ${req.ip}`);
        return res.status(200).send(`Your total income is: ${data}`);
    }).catch(err => next(err));
});

router.get('/', authMe, async (req, res, next) => {
    try {
        const users = await Users.find();
        res.status(200).send(users);
    } catch (err) {
        return next(new CustomError(`An error occurred while trying to get all users. Error: ${err}`, 500));
    }
});

router.post('/addUser', authMe, PremiumAuth, async (req, res, next) => {
    createUserUnderRoot(req.body, res).then(user => {
        logger.info(`201 Created - /user/addUser - POST - ${req.ip}`);
        res.status(201).send(`${user.username} has been successfully added to your business!`);
    }).catch(err => next(err));
});

router.put('/upgradeToPremium', authMe, async (req, res, next) => { // just some testing stuff
    try {
        const user = res.locals.user;
        console.log(`profiles are ${user.profile}`);
        if(user.profile) {
        user.profile.role = 'Root';
        await user.profile.save();
        const newBusiness = Business.create({
            businessName: user.profile.firstName + "'s Business",
            rootUserID: user.id,
            users: [user],
        });
        await newBusiness.save();

        user.business = newBusiness;

        await user.save();
        }
        logger.info(`200 OK - /user/upgradeToPremium - PUT - ${req.ip}`);
        res.status(200).send(`You have been upgraded to premium successfully ${user.username}!`);
    } catch (err) {
        return next(new CustomError(`An error occurred while trying to upgrade you to premium. Error: ${err}`, 500));
    }
});

router.get('/businessUsers', authMe, PremiumAuth, async (req, res, next) => {
    businessUsers(res).then(users => {
        logger.info(`200 OK - /user/businessUsers - GET - ${req.ip}`);
        res.status(200).send(users);
    }).catch(err => next(err));
});

router.get('/businessBalance', authMe, PremiumAuth, async (req, res, next) => {
    businessBalance(res).then(balance => {
        logger.info(`200 OK - /user/businessBalance - GET - ${req.ip}`);
        res.status(200).send(`Your business balance is: ${balance}`);
    }).catch(err => next(err));
});
export default router;