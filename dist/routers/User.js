import express from 'express';
import { insertUser } from '../controllers/User.js';
import { Users } from '../db/entities/Users.js';
const router = express.Router();
router.post('/', async (req, res) => {
    try {
        const newUser = await insertUser(req.body);
        res.send(`A new user has been added to the database!`);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
router.get('/', async (req, res) => {
    try {
        const users = await Users.find();
        res.send(users);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
export default router;
