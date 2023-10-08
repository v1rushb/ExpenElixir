import express from 'express';
import { Users } from '../db/entities/Users.js';
import { calculateTotalIncome, insertUser, login } from '../controllers/User.js';
import authme from '../middlewares/Auth.js';
import jwt from 'jsonwebtoken';
const router = express.Router();
//registering a new user using the insertUser function from the User controller.
//ps: do the the error handling thingy whenever you can. (mid priority)
router.post('/register', authme, async (req, res) => {
    const eamil = req.body.email;
    const found = await Users.findOne({ where: { email: eamil } });
    if (found) {
        return res.status(400).send(`User with email: ${req.body.email} already exists.`);
    }
    insertUser(req.body).then(user => {
        res.status(200).send(`You have successfully registered! ${user.firstName}`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to register you. error: ${err}`);
    });
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
    }
    catch (err) { }
    if (email && password) {
        login(email, password).then(data => {
            res.cookie("userEmail", data.email, { maxAge: 30 * 60 * 1000 });
            res.cookie("token", data.token, { maxAge: 30 * 60 * 1000 });
            res.cookie("loginDate", Date.now(), { maxAge: 30 * 60 * 1000 });
            res.status(200).send(`You have successfully logged in ${data.username}!`);
        }).catch(err => {
            //next("Something went really really wrong my dude.");
            console.error(err);
            res.status(400).send(`Something went wrong my dude.`);
        });
    }
    else {
        //next("Invalid email or password.");
        res.status(400).send(`Invalid email or password.`);
    }
});
router.post('/logout', (req, res) => {
    const token = req.cookies["token"];
    if (!token) {
        return res.status(400).send("You are not logged in.");
    }
    try {
        jwt.verify(token, process.env.SECRET_KEY || '');
        const decoded = jwt.decode(token || '', { json: true });
        res.clearCookie("userEmail");
        res.clearCookie("token");
        res.clearCookie("loginDate");
        res.status(200).send(`You have been logged out. See you soon ${decoded?.username}!`);
    }
    catch (err) {
        res.status(400).send("Your session has expired or is invalid. Please log in again.");
    }
});
router.get('/totalIncome', authme, async (req, res) => {
    calculateTotalIncome(req).then(data => {
        return res.status(200).send(`Your total income is: ${data}`);
    }).catch(err => {
        return res.status(400).send(`Something went wrong. ${err}`);
    });
});
router.get('/', authme, async (req, res) => {
    try {
        const users = await Users.find();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
export default router;
