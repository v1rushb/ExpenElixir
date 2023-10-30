import { DataSource } from "typeorm";
import { Users } from "./entities/Users.js";
import { Expense } from "./entities/Expense.js";
import { Category } from "./entities/Category.js";
import { Income } from "./entities/Income.js";
import { Profile } from "./entities/Profile.js";
import { Business } from "./entities/Business.js";

console.log(process.env);

const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Users, Expense, Category, Income, Profile, Business],
    //migrations: ['./**/migration/*.ts'],
    logging: false,
    synchronize: true
});

export const initDB = async () =>
    await dataSource.initialize().then(() => {
        console.log("Connected to DB!");
    }).catch(err => {
        console.error('Failed to connect to DB: ' + err);
    });

export default dataSource;
