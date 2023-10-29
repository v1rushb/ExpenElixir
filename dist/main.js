import express from 'express';
import 'dotenv/config';
import "reflect-metadata";
import db from './db/dataSource.js';
import userRouter from './routers/User.js';
import incomeRouter from './routers/Income.js';
import categoryRouter from './routers/Category.js';
import expenseRouter from './routers/Expense.js';
import cookieParser from 'cookie-parser';
import logger from './logger.js';
import ErrorHandler from './middlewares/ErrorHandler.js';
import { checkForSubscriptionValidation, checkForVerification } from './controllers/User.js';
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
    logger.info('Full HP [200] - /health - GET');
    res.status(200).send('Full HP');
});
app.use('/', (req, res) => {
    logger.error(`404 Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(404).send('Route Does not exist');
});
app.use(ErrorHandler);
app.listen(PORT, () => {
    console.log(`Server is ON and running on PORT: ${PORT}`);
    db.initialize().then(() => {
        console.log(`Connected to DB dude!`);
        checkForVerification();
        checkForSubscriptionValidation();
    }).catch(err => {
        console.error(`Failed to connect to the database. Error: ${err}`);
    });
});
//# sourceMappingURL=main.js.map