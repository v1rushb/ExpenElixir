import dataSource from "../db/dataSource.js";
import { Users } from "../db/entities/Users.js";

export const insertUser = async (payload: any) => {
    return await dataSource.transaction(async trans => {
        const newUser = Users.create({
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            username: payload.username,
            password: payload.password,
        });
        return await trans.save(newUser);
    });
};


