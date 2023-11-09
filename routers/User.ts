import express from 'express';
import { Users } from '../db/entities/Users.js';
import { calculateBalance, deleteUser, insertUser, logMe, login, logout, sendResetPasswordEmail, upgradeToBusinessUser } from '../controllers/User.js';
import authMe from '../middlewares/Auth.js';
import { validateLogin, validatePassword, validateUser } from '../middlewares/Validate.js';
import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import { CustomError } from '../CustomError.js';
import businessUser from '../middlewares/businessUser.js';
import { stripe } from '../stripe-config.js';
import getCards from '../middlewares/cards.js';
import { Gen } from '../@types/generic.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { upgradeToBusiness } from '../controllers/Business.js';

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
    const user = res.locals.user;
    try {
        if(user?.profile?.role === 'User')
            throw new CustomError(`You are not allowed to delete your account.`, 400);

        deleteUser(res).then(() => {
            logger.info(`200 OK - /user/delete-account - DELETE - ${req.ip}`);
            res.clearCookie("userEmail");
            res.clearCookie("token");
            res.clearCookie("loginDate");
            res.status(200).send(`Your account has been deleted successfully.`);
        }).catch((err: any) => next(err));
    } catch (err) {
        next(err);
    }
});

router.get('/verify-account', async (req, res, next) => {
    try {
        const { token } = req.query;
        if (!token)
            throw new CustomError(`Invalid token.`, 400);

        const user = await Users.findOne({ where: { verificationToken: token as string } });
        if (!user)
            throw new CustomError(`Invalid token.`, 400);

        user.isVerified = true;
        user.verificationToken = ' ';
        await user.save();

        logger.info(`200 OK - /user/verify-email - GET - ${req.ip}`);
        res.status(200).send(`Email verified successfully. Welcome aboard ${user.username}!`);
    } catch (err) {
        next(err);
    }
});

router.post('/reset-password', validatePassword, async (req, res, next) => {
    const { email, newPassword } = req.body;
    try {
        if (!email) {
            throw new CustomError('Email is required', 400);
        }
        if (!newPassword) {
            throw new CustomError('new password is required', 400);
        }
        const user = await Users.findOne({ where: { email } });

        if (!user) {
            throw new CustomError('User not found', 404);
        }

        if (bcrypt.compareSync(newPassword, user.password))
            throw new CustomError('You cannot use your old password.', 400);
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.newHashedPassword = hashedPassword;
        const resetToken = uuidv4();
        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 300000);
        await sendResetPasswordEmail({ email: email, token: resetToken });
        await user.save();
        res.clearCookie("userEmail");
        res.clearCookie("token");
        res.clearCookie("loginDate");
        res.status(200).send('Please check your mailbox to continue in resetting your password.');
    } catch (err) {
        next(err);
    }
});

router.get('/reset-password-email', async (req, res, next) => {
    const { token } = req.query;
    try {
        if (!token)
            throw new CustomError(`Invalid token.`, 400);
        const user = await Users.findOne({ where: { resetToken: token as string } });
        if (!user)
            throw new CustomError(`Invalid token.`, 400);

        if (user.resetTokenExpiration && user.resetTokenExpiration < new Date(Date.now()))
            throw new CustomError(`Token expired.`, 400);

        user.password = user.newHashedPassword ? user.newHashedPassword : user.password;
        user.resetToken = '';
        user.resetTokenExpiration = undefined;
        user.newHashedPassword = '';
        await user.save();
        res.clearCookie("userEmail");
        res.clearCookie("token");
        res.clearCookie("loginDate");
        res.send('Your password has been changed successfully!');
    } catch (err) {
        next(err);
    }
});

router.put('/', authMe, async (req, res, next) => {
    try {
        const user = res.locals.user;
        const { username, email, password } = req.body;
        if (await bcrypt.compare(password, user.password)) {
            if (username)
                user.username = username;
            if (email)
                user.email = email;
            if (password)
                user.password = await bcrypt.hash(password, 10);
            await user.save();
            res.status(200).send('User updated successfully.');
        }
        throw new CustomError('Invalid password.', 400);
    } catch (err) {
        next(err);
    }
});

router.use('/business', businessUser);

export default router;