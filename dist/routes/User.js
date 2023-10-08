import express from 'express';
import { User } from '../db/entities/User.js';
import { insertUser, login } from '../controllers/User.js';
import authme from '../middlewares/Auth.js';
const router = express.Router();
//registering a new user using the insertUser function from the User controller.
router.post('/register', authme, async (req, res) => {
    insertUser(req.body).then(user => {
        res.status(200).send(`You have successfully registered! ${user}`);
    }).catch(err => {
        res.status(401).send(`An error occured while trying to register you. error: ${err}`);
    });
});
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
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
    res.clearCookie("userEmail");
    res.clearCookie("token");
    res.clearCookie("loginDate");
    res.status(200).send(`You have been logged out.`);
});
router.get('/', authme, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
export default router;
