import express from 'express';
import 'dotenv/config';
import "reflect-metadata";
import db from './db/dataSource.js';
import userRouter from './routers/User.js'
import { Users } from './db/entities/Users.js';
import dataSource from './db/dataSource.js';


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;



app.get('/health', (req, res) => {
    res.status(200).send('Full HP');
});

app.use('/user', userRouter)

app.get('/', (req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server is ON and running on PORT: ${PORT}`);
    db.initialize().then(() => {
        console.log(`Connected to DB dude!`);
    }).catch(err => {
        console.error(`Failed to connect to the database. Error: ${err}`);
    });
});
