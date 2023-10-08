import { DataSource } from "typeorm";
import { Users } from "./entities/Users.js";
import { Expense } from "./entities/Expense.js";
import { Category } from "./entities/Category.js";
import { Income } from "./entities/Income.js";
console.log(process.env.DB_PORT);
console.log(process.env.DB_HOST);
const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Users, Expense, Category, Income],
    //migrations: ['./**/migration/*.ts'],
    logging: true,
    // synchronize: true
});
export default dataSource;
