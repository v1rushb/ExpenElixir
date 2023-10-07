import { DataSource } from "typeorm";
console.log(process.env.DB_PORT);
console.log(process.env.DB_PASSWORD);
const dataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [],
    //migrations: ['./**/migration/*.ts'],
    logging: true,
    synchronize: true
});
export default dataSource;
