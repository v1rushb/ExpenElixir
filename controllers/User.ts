import express from 'express';
import dataSource from "../db/dataSource.js";
import { Users } from "../db/entities/Users.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Gen } from '../@types/generic.js';
import { totalIncomes } from './Income.js';
import { totalExpenses } from './Expense.js';
import { CustomError } from '../CustomError.js';
import { Profile } from '../db/entities/Profile.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../utils/sesServiceAws.js';
import logger from '../logger.js';
import { stripe } from '../stripe-config.js';
import { upgradeToBusiness } from './Business.js';


const insertUser = async (payload: Gen.User): Promise<Users> => {
  try {
    const user = await Users.findOne({ where: { email: payload.email } }) as Users;

    if (user) {
      if (!user.isVerified) {
        throw new CustomError('Please verify your email address.', 423);
      } else {
        throw new CustomError(`User with email: ${payload.email} already exists.`, 409);
      }
    }
    return await dataSource.transaction(async trans => {
      const { firstName, lastName, phoneNumber } = payload;
      const createdAt = new Date();
      const newProfile = Profile.create({ firstName, lastName, phoneNumber, hasSentEmail: false });
      await trans.save(newProfile);

      const { email, username, password } = payload;
      const newUser = Users.create({ email, username, password, profile: newProfile, createdAt });

            
            const verificationToken = uuidv4();
            newUser.verificationToken = verificationToken;
            
            const host = process.env.HOST || 'localhost:2073';
            const verificationLink = 'http://' + host + '/user/verify-account?token=' + verificationToken;
            const emailBody = "Dear User,\n\nThank you for registering. To complete your account setup, please verify your account by clicking the link below:\n" + verificationLink + "\n\nIf you didn't create this account, you can safely ignore this email.\n\nBest regards,\nYour Company Support Team";
            const emailSubject = 'ExpenElixir Email Verification';
            sendEmail(email,emailBody, emailSubject);
            return await trans.save(newUser);
        });
    } catch (err: any) {
        if (err.code?.includes('ER_DUP_ENTRY') || err instanceof CustomError && err.statusCode === 409) {
            throw new CustomError(`User with email: ${payload.email} or username: ${payload.username} already exists.`, 409);
        }
        throw new CustomError(err, 500);
    }
};

const login = async (payload: Gen.login): Promise<Gen.loginReturn> => {
  try {
    
      const user = await Users.findOne({ where: { username: payload.username } }) as Users;

      if (!user || user.username !== payload.username) {
        throw new CustomError('Invalid credentials', 400);
      }
      
      
      if (user?.profile?.role === 'User') {
        if (!payload.iamId || user.iamId !== payload.iamId) {
          throw new CustomError('IAM users must provide a valid IAM ID', 401);
        }
        if(user.business.rootUserID) {
          const rootUser = await Users.findOne({where: {id: user.business.rootUserID}});
          if(rootUser?.profile.role !== 'Root') {
            throw new CustomError('Unauthorized', 401);
          }
        }
      }
      
      const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
      if (!isPasswordMatch) {
        throw new CustomError('Invalid password', 401);
      }
      
      if(!user.isVerified) {
        throw new CustomError('Please verify your email address.', 409);
      }
      const token = jwt.sign(
        {
          email: user.email,
          username: user.username,
          id: user.id,
        },
        process.env.SECRET_KEY || '',
        {
          expiresIn: '15m',
        }
      );
  
      return { username: user.username, email: user.email, token: token };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(`An error occurred during login. Error: ${err}`, 501);
    }
  };

const calculateBalance = async (res: express.Response): Promise<string> => {
  try {
    return `Your account Balance : ${await totalIncomes(res) - await totalExpenses(res)}`
  }
  catch (err) {
    throw new CustomError(`Unexpected Error ${err}`, 500);
  }
}

const deleteUser = async (res: express.Response): Promise<void> => {
  const user: Users = res.locals.user;
  try {
      await Users.delete(user.id);
  } catch (err: any) {
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
    } catch (err) {
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
            await sendEmail(user.email,`Your subscription has expired!`, `Subscription Expired!`);

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
    } catch (err) {
      logger.error(`Scheduled task failed. Error: ${err}`);
    }
  }, 60000);

}

const sendResetPasswordEmail = async (payload: Gen.sendResetPasswordEmail): Promise<void> => {
  const host = process.env.HOST || 'localhost:2077';
  const resetLink = 'http://' + host + '/user/reset-password-email?token=' + payload.token;
  const emailSubject = 'ExpenElixir User Password Reset';
  const emailBody = "Dear User,\n\nWe received a request to reset your password. If you didn't make the request, please ignore this email.\n\nTo reset your password, click the link below:\n" + resetLink + "\n\nThis link will expire in 30 minutes.\n\nBest regards,\nExpenElixir Support team.";

  await sendEmail(payload.email,emailBody, emailSubject);
}

const logout = async (req: express.Request,res: express.Response): Promise<string> => {
  const token = req.cookies["token"];
  try {
      if (!token) {
          throw new CustomError(`You are not logged in.`, 401);
      }

      jwt.verify(token, process.env.SECRET_KEY || '');
      const decoded = jwt.decode(token || '', { json: true });

      res.clearCookie("userEmail");
      res.clearCookie("token");
      res.clearCookie("loginDate");
      return decoded?.username;
  } catch (err) {
      res.clearCookie("userEmail");
      res.clearCookie("token");
      res.clearCookie("loginDate");
      throw new CustomError(`Your session has already been expired.`, 401);
  }
}

const upgradeToBusinessUser = async (req: express.Request, res: express.Response): Promise<void> => {
   try {
        const selectedCard = Number(req.body.card);
        if ((!selectedCard && selectedCard !==0) || selectedCard < 0 && selectedCard > 2) {
            throw new CustomError(`You must select a valid card.`, 400);
        }

        const card: Gen.card = res.locals.cards[selectedCard];
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
                    throw new CustomError(`You are not allowed here.`, 401);
                }
                await upgradeToBusiness(res);
            } catch (err: any) {
                throw err;
            }
        } else {
            throw new CustomError(`Payment failed.`, 400);
        }
    } catch (err: any) {
        throw err;
    }
}

const logMe = async (req: express.Request, res: express.Response): Promise<void> => {
  const { username, password, iamId } = req.body;
  const token = req.cookies["token"];

  try {
      if (token) {
              jwt.verify(token, process.env.SECRET_KEY || '')
              throw new CustomError(`You are already logged in.`, 409);
          }
  } catch (err: any) {
      if(err.name === 'TokenExpiredError') {
        res.clearCookie("userEmail");
        res.clearCookie("token");
        res.clearCookie("loginDate");
        throw new CustomError (`Your session has already been expired.`, 401);
      }
      throw err;
  }

  if (username && password) {
      const payload: Gen.login = {username, password, iamId,res};
      await login(payload).then(data => {
          res.cookie("userEmail", data.email, { maxAge: 30 * 60 * 1000 });
          res.cookie("token", data.token, { maxAge: 30 * 60 * 1000 });
          res.cookie("loginDate", Date.now(), { maxAge: 30 * 60 * 1000 });
      }).catch(err => {
        throw err;
      });
  }
  else {
      throw new CustomError(`Invalid username or password.`, 401);
  }
}

const deleteMe = async (req: express.Request, res: express.Response): Promise<void> => {
  const user = res.locals.user;
  try {
      if(user?.profile?.role === 'User')
          throw new CustomError(`You are not allowed to delete your account.`, 400);

          await deleteUser(res).then(() => {
          logger.info(`200 OK - /user/delete-account - DELETE - ${req.ip}`);
          res.clearCookie("userEmail");
          res.clearCookie("token");
          res.clearCookie("loginDate");
          res.status(200).send(`Your account has been deleted successfully.`);
      }).catch(err => {
        throw err
      });
  } catch (err) {
      throw err;
  }
}

const verifyAccount = async (req: express.Request, res: express.Response): Promise<string> => {
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
      return user.username;
    } catch (err) {
        throw err;
    }
}

const resetPassword = async (req: express.Request, res: express.Response): Promise<void> => {
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
    } catch (err) {
      throw err;
    }
}

const resetPasswordEmail = async (req: express.Request, res: express.Response): Promise<void> => {
    const { token } = req.query;
    try {
        const user = await Users.findOne({ where: { resetToken: token as string } });
        if (!user || !token)
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
    } catch (err) {
      throw err;
    }
}

const updateUser = async (req: express.Request, res: express.Response): Promise<void> => {
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
      }
      throw new CustomError('Invalid password.', 400);
    } catch (err) {
      throw err;
    }
}

export {
  insertUser,
  login,
  calculateBalance,
  deleteUser,
  checkForVerification,
  sendResetPasswordEmail,
  checkForSubscriptionValidation,
  logout,
  upgradeToBusinessUser,
  logMe,
  deleteMe,
  verifyAccount,
  resetPassword,
  resetPasswordEmail,
  updateUser,
}