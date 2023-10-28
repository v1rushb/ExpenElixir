import dataSource from "../db/dataSource.js";
import { Users } from "../db/entities/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { totalIncomes } from './Income.js';
import { totalExpenses } from './Expense.js';
import { CustomError } from '../CustomError.js';
import { Profile } from '../db/entities/Profile.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/sesServiceAws.js';
import logger from '../logger.js';
const insertUser = async (payload) => {
    try {
        const user = await Users.findOne({ where: { email: payload.email } });
        if (user) {
            if (!user.isVerified) {
                throw new CustomError('Please verify your email address.', 423);
            }
            else {
                throw new CustomError(`User with email: ${payload.email} already exists.`, 409);
            }
        }
        return await dataSource.transaction(async (trans) => {
            const { firstName, lastName, phoneNumber } = payload;
            const createdAt = new Date();
            const newProfile = Profile.create({ firstName, lastName, phoneNumber, hasSentEmail: false });
            await trans.save(newProfile);
            const { email, username, password } = payload;
            const newUser = Users.create({ email, username, password, profile: newProfile, createdAt });
            const verificationToken = uuidv4();
            newUser.verificationToken = verificationToken;
            const host = process.env.HOST || 'localhost:2000';
            const verificationLink = 'http://' + host + '/user/verify-account?token=' + verificationToken;
            const emailBody = 'Please verify your account by clicking the link: ' + verificationLink;
            const emailSubject = 'EpenElixir Email Verification';
            sendEmail(emailBody, emailSubject);
            return await trans.save(newUser);
        });
    }
    catch (err) {
        if (err.code?.includes('ER_DUP_ENTRY')) {
            throw new CustomError(`User with email: ${payload.email} or username: ${payload.username} already exists.`, 409);
        }
        throw new CustomError(err, 500);
    }
};
const login = async (payload) => {
    try {
        console.log(payload.iamId);
        const user = await Users.findOne({ where: { username: payload.username } });
        if (!user || user.username !== payload.username) {
            throw new CustomError('Invalid credentials', 400);
        }
        const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
        if (!isPasswordMatch) {
            throw new CustomError('Invalid password', 401);
        }
        if (!user.isVerified) {
            throw new CustomError('Please verify your email address.', 409);
        }
        const token = jwt.sign({
            email: user.email,
            username: user.username,
            id: user.id,
        }, process.env.SECRET_KEY || '', {
            expiresIn: '30m',
        });
        return { username: user.username, email: user.email, token: token };
    }
    catch (err) {
        if (err instanceof CustomError) {
            throw err;
        }
        throw new CustomError(`An error occurred during login. Error: ${err}`, 501);
    }
};
const calculateBalance = async (res) => {
    try {
        return `Your account Balance : ${await totalIncomes(res) - await totalExpenses(res)}`;
    }
    catch (err) {
        throw new CustomError(`Unexpected Error ${err}`, 500);
    }
};
const deleteUser = async (res) => {
    const user = res.locals.user;
    try {
        if (user.business) {
            const businessUsers = await Users.find({ where: { business: { id: user.business.id } } });
            for (const businessUser of businessUsers) {
                await Users.delete(businessUser.id);
            }
        }
        else {
            await Users.delete(user.id);
        }
    }
    catch (err) {
        throw new CustomError(`Internal Server Error`, 500);
    }
};
const checkForVerification = () => {
    setInterval(async () => {
        try {
            const users = await Users.find({ where: { isVerified: false } });
            const currentTime = new Date();
            const expiredUsers = users.filter(user => {
                const userCreationTime = new Date(user.createdAt);
                return (currentTime.getTime() - userCreationTime.getTime()) >= 60000;
            });
            for (const user of expiredUsers) {
                await Users.delete({ id: user.id });
            }
            logger.info(`Scheduled task completed successfully, deleted ${expiredUsers.length} users.`);
        }
        catch (err) {
            logger.error(`Scheduled task failed. Error: ${err}`);
        }
    }, 60000);
};
const checkForSubscriptionValidation = () => {
    setInterval(async () => {
        try {
            const users = await Users.find({ where: { profile: { role: 'Root' } } });
            const now = new Date().getTime();
            for (const user of users) {
                const { profile } = user;
                if (profile?.role === 'Root' && profile.subscription_date) {
                    const subscriptionDate = new Date(profile.subscription_date).getTime();
                    const diff = (now - subscriptionDate) / (1000 * 60);
                    if (diff > 15) {
                        await sendEmail(`Your subscription has expired!`, `Subscription Expired!`);
                        if (profile) {
                            profile.hasSentEmail = true;
                            profile.role = 'Member';
                            user.profile = profile;
                            await user.save();
                        }
                    }
                }
            }
            logger.info(`Scheduled task completed successfully, checked ${users.length} users.`);
        }
        catch (err) {
            logger.error(`Scheduled task failed. Error: ${err}`);
        }
    }, 60000);
};
const sendResetPasswordEmail = async (payload) => {
    const host = process.env.HOST || 'localhost:2000';
    const resetLink = 'http://' + host + '/user/reset-password-email?token=' + payload.token;
    const emailSubject = 'ExpenElixir User Password Reset';
    const emailBody = 'Please reset your password by clicking the link: ' + resetLink;
    await sendEmail(emailBody, emailSubject); // add email   await sendEmail(payload.email,emailBody, emailSubject)
};
export { insertUser, login, calculateBalance, deleteUser, checkForVerification, sendResetPasswordEmail, checkForSubscriptionValidation, };
//# sourceMappingURL=User.js.map