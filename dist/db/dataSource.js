import { DataSource } from "typeorm";
import { Users } from "./entities/Users.js";
import { Expense } from "./entities/Expense.js";
import { Category } from "./entities/Category.js";
import { Income } from "./entities/Income.js";
import { Profile } from "./entities/Profile.js";
import { Business } from "./entities/Business.js";
const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Users, Expense, Category, Income, Profile, Business],
    //migrations: ['./**/migration/*.ts'],
    logging: true,
    synchronize: false
});
export default dataSource;
//# sourceMappingURL=dataSource.js.map