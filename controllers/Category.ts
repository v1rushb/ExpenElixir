import express from 'express';
import dataSource from "../db/dataSource.js";
import { Category } from "../db/entities/Category.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';
import { CustomError } from '../CustomError.js';
import { decodeToken } from './Income.js';

const insertCategory = async (payload: Gen.Category, req: express.Request) => {
    try {
        const decode = jwt.decode(req.cookies["token"], { json: true });
        return dataSource.manager.transaction(async trans => {

            const newCategory = Category.create({
                title: payload.title, description: payload.description,
            });
            await trans.save(newCategory);
            const user = await Users.findOne({
                where: { id: decode?.id },
                relations: ["categories"],
            });
            if (!user) {
                throw new CustomError(`User not found.`, 404); // This should never happen. (unless token becomes suddenly invalid for some reason lol)
            }
            user.categories.push(newCategory);
            await trans.save(user);
        });
    }
    catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
}

const deleteAllCategory = async (req: express.Request) => {
    const decode = jwt.decode(req.cookies["token"], { json: true });
    return dataSource.manager.transaction(async trans => {
        const user = await Users.findOneOrFail({
            where: { id: decode?.id },
            relations: ["categories"],
        });
        await Category.delete({ users: user.id });
    });
}

const deleteCategory = async (id: string): Promise<Category> => {
    try {
        const category = await Category.findOne({ where: { id } });
        if (!category)
            throw new CustomError(`category with id: ${id} was not found!`, 404);
        await Category.remove(category);
        return category;
    } catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
}

const totalCategory = async (req: express.Request): Promise<Category[]> => {
    try {
        const decode = decodeToken(req);
        const user = await Users.findOne({
            where: { id: decode?.id }
        });

        if (!user) throw new CustomError('User not found', 404);

        return user?.categories as Category[];
    } catch (err) {
        if (err instanceof CustomError)
            throw err;
        throw new CustomError(`Internal Server Error`, 500);
    }
}


export {
    insertCategory,
    deleteAllCategory,
    deleteCategory,
    totalCategory,
}