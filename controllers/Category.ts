import express from 'express';
import dataSource from "../db/dataSource.js";
import { Category } from "../db/entities/Category.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';

const insertCategory = async (payload: Gen.Category, req: express.Request) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async trans => {

            const newCategory = Category.create({
                title: payload.title, description: payload.description,
            });
            await trans.save(newCategory);
            console.log(decode?.id);
            const user = await Users.findOne({
                where: { id: decode?.id },
                relations: ["categories"],
            });
            if (!user) {
                throw ("User not found."); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
            user.categories.push(newCategory);
            await trans.save(user);
        });
    }
    catch (err) {
        throw (err);
    }
}

const deleteAllCategory = async (req: express.Request) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async trans => {
            const user = await Users.findOneOrFail({
                where: { id: decode?.id },
                relations: ["categories"],
            });

            await Category.delete({ users: user.id });
        });
    }
    catch (err) {
        throw (err);
    }
}

const deleteCategory = async (id: string) => {
    try {
        const category = await Category.findOne({ where: { id } });
        if (!category)
            throw (`category with id: ${id} was not found!`);
        await Category.remove(category);
    } catch (err) {
        throw (`An error occurred while trying to delete the category. ${err}`);
    }
}


export {
    insertCategory,
    deleteAllCategory,
    deleteCategory,
}