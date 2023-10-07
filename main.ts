import express from 'express';
import 'dotenv/config';
import "reflect-metadata";
import db from './db/dataSource.js';
import { User } from './db/entities/User.js';
import dataSource from './db/dataSource.js';


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 2077;

const insertUser = async (payload: any) => {
    return await dataSource.transaction(async trans => {
        const newUser = User.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            username: payload.username,
            password: payload.password, // Make sure to hash the password before saving.
        });
        return await trans.save(newUser);
    });
};

app.post('/addUser', async (req, res) => {
    try {
        const newUser = await insertUser(req.body);
        res.send(`A new user has been added to the database!`);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/User', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/health',(req,res)=> {
    res.status(200).send('Full HP');
});

app.get('/*',(req,res)=> { 
        res.status(404).send('Not Found');
});

app.listen(PORT,()=> {
    console.log(`Server is ON and running on PORT: ${PORT}`);
    db.initialize().then(()=> {
        console.log(`Connected to DB dude!`);
    }).catch(err=> {
        console.error(`Failed to connect to the database. Error: ${err}`);
    });
});
