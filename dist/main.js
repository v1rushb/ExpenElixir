import express from 'express';
import 'dotenv/config';
import "reflect-metadata";
import db from './db/dataSource.js';
import userRouter from './routers/User.js';
import incomeRouter from './routers/Income.js';
import categoryRouter from './routers/Category.js';
import expenseRouter from './routers/Expense.js';
import cookieParser from 'cookie-parser';
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 2077;
app.use('/user', userRouter);
app.use('/income', incomeRouter);
app.use('/expense', expenseRouter);
app.use('/category', categoryRouter);
app.get('/', (req, res) => {
    res.status(404).send('Not Found');
});
app.get('/health', (req, res) => {
    res.status(200).send('Full HP');
});
app.listen(PORT, () => {
    console.log(`Server is ON and running on PORT: ${PORT}`);
    db.initialize().then(() => {
        console.log(`Connected to DB dude!`);
    }).catch(err => {
        console.error(`Failed to connect to the database. Error: ${err}`);
    });
});
