import express from 'express';
import { calculateBalance, deleteMe, insertUser, logMe, logout, resetPassword, resetPasswordEmail, updateUser, upgradeToBusinessUser, verifyAccount } from '../controllers/User.js';
import authMe from '../middlewares/Auth.js';
import { validateLogin, validatePassword, validateUser } from '../middlewares/Validate.js';
import logger from '../logger.js';
import businessUser from '../middlewares/businessUser.js';
import getCards from '../middlewares/cards.js';

const router = express.Router();

router.post('/register', validateUser, async (req, res, next) => {
    insertUser(req.body).then(user => {
        logger.info(`201 Created - /user/register - POST - ${req.ip}`);
        res.status(201).send(`You have been registered successfully ${user.username}. Please check your mail box for email verification.`);
    }).catch(err => next(err));
});


router.post('/login', validateLogin, (req, res, next) => {
    logMe(req, res).then(() => {
        logger.info(`200 OK - /user/login - POST - ${req.ip}`);
        res.status(200).send(`Welcome back ${req.body.username}!`);
    }).catch(err => next(err));
});

router.post('/logout', (req, res,next) => {
    logout(req,res).then(name => {
        logger.info(`200 OK - /user/logout - POST - ${req.ip}`);
        res.status(200).send(`You have been logged out. See you soon ${name}!`);
    }).catch(err => next(err));
});

router.get('/balance', authMe, async (req, res, next) => {
    calculateBalance(res).then(async data => {
        logger.info(`200 OK - /user/totalIncome - GET - ${req.ip}`);
        return res.status(200).send(`Your total income is: ${data} ${res.locals.user.profile.Currency}.`);
    }).catch(err => next(err));
});

router.post('/upgrade-to-business', authMe, getCards, async (req, res, next) => {
    upgradeToBusinessUser(req,res).then(() => {
        logger.info(`200 OK - /user/upgrade-to-business - POST - ${req.ip}`);
        res.status(200).send(`You have been upgraded to business user successfully.`);
    }).catch(err => next(err));
});

router.delete('/delete-account', authMe, async (req, res, next) => {
    deleteMe(req, res).then(() => {
        logger.info(`200 OK - /user/delete-account - DELETE - ${req.ip}`);
        res.status(200).send(`Your account has been deleted successfully.`);
    }).catch(err=>next(err));
});

router.get('/verify-account', async (req, res, next) => {
    verifyAccount(req, res).then(username => {
        logger.info(`200 OK - /user/verify-email - GET - ${req.ip}`);
        res.status(200).send(`Email verified successfully. Welcome aboard ${username}!`);
    }).catch(err => next(err));
});

router.post('/reset-password', validatePassword, async (req, res, next) => {
    resetPassword(req, res).then(() => {
        logger.info(`200 OK - /user/reset-password - POST - ${req.ip}`);
        res.status(200).send(`A reset password email has been sent to you. Please check your mailbox.`);
    }).catch(err => next(err));
});

router.get('/reset-password-email', async (req, res, next) => {
    resetPasswordEmail(req, res).then(() => {
        logger.info(`200 OK - /user/reset-password-email - GET - ${req.ip}`);
        res.send('Your password has successfully been changed!');
    }).catch(err =>next(err));
});

router.put('/', authMe, async (req, res, next) => {
    updateUser(req,res).then(() => {
        logger.info(`200 OK - /user/ - PUT - ${req.ip}`);
        res.status(200).send('User updated successfully.');
    }).catch(err=> next(err));
});

router.use('/business', businessUser);

export default router;