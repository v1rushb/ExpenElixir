import express from 'express';
import { Users } from '../db/entities/Users.js';
import { calculateBalance, insertUser, login } from '../controllers/User.js';
import authMe from '../middlewares/Auth.js';
import { validateUser } from '../middlewares/Validate.js';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import { CustomError } from '../CustomError.js';
import businessUser from '../middlewares/businessUser.js';
import { stripe } from '../stripe-config.js';
import { upgradeToBusiness } from '../controllers/Business.js';
import getCards from '../middlewares/cards.js';
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
    const { username, password, iamId } = req.body;
    const token = req.cookies["token"];
    console.log(username);
    console.log(password);
    try {
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY || '');
            return res.status(400).send(`You are already logged in.`);
        }
    }
    catch (err) {
        return next(new CustomError(`Your session has expired or is invalid. Please log in again.`, 400));
    }
    if (username && password) {
        login(username, password, iamId, res).then(data => {
            res.cookie("userEmail", data.email, { maxAge: 30 * 60 * 1000 });
            res.cookie("token", data.token, { maxAge: 30 * 60 * 1000 });
            res.cookie("loginDate", Date.now(), { maxAge: 30 * 60 * 1000 });
            logger.info(`200 OK - /user/login - POST - ${req.ip}`);
            res.status(200).send(`You have successfully logged in ${data.username}!`);
        }).catch(err => next(err));
    }
    else {
        return next(new CustomError(`Invalid username or password.`, 401));
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
    }
    catch (err) {
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
    }
    catch (err) {
        return next(new CustomError(`An error occurred while trying to get all users. Error: ${err}`, 500));
    }
});
router.post('/upgrade-to-business', authMe, getCards, async (req, res, next) => {
    try {
        const selectedCard = Number(req.body.card);
        if (!selectedCard || selectedCard < 0 || selectedCard > 2) {
            throw new CustomError(`You must select a valid card.`, 400);
        }
        const card = res.locals.cards[selectedCard];
        if (card.cardExp <= new Date()) {
            throw new CustomError(`Card expired.`, 400);
        }
        if (card.amount < 3000) {
            throw new CustomError(`Insufficient funds.`, 400);
        }
        const { name, email } = res.locals.user;
        const customer = await stripe.customers.create({
            name,
            email,
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 3000,
            currency: 'usd',
            customer: customer.id,
            payment_method: 'pm_card_visa',
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntent.id);
        if (confirmedPaymentIntent.status === 'succeeded') {
            try {
                const user = res.locals.user;
                if (user.profile.role !== 'Member') {
                    if (user.profile.role === 'Root') {
                        throw new CustomError(`You are already a business user.`, 400);
                    }
                    throw new CustomError(`You are not allowed here.`, 400);
                }
                await upgradeToBusiness(res);
                logger.info(`200 OK - /user/upgrade-to-business - POST - ${req.ip}`);
                res.status(200).send('Payment succeeded');
            }
            catch (err) {
                throw err;
            }
        }
        else {
            throw new CustomError(`Payment failed.`, 400);
        }
    }
    catch (err) {
        next(err);
    }
});
router.use('/business', businessUser);
export default router;
//# sourceMappingURL=User.js.map