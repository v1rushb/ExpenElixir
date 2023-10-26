import express from 'express';
import dataSource from "../db/dataSource.js";
import { Category } from "../db/entities/Category.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';
import { CustomError } from '../CustomError.js';
import { EqualOperator } from 'typeorm';

const insertCategory = async (payload: Gen.Category, res: express.Response) => {
    try {
        return dataSource.manager.transaction(async trans => {

            const newCategory = Category.create({
                title: payload.title, description: payload.description,
            });
            await trans.save(newCategory);
            const user = await Users.findOne({
                where: { id: res.locals.user.id },
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

const deleteAllCategory = async (res: express.Response) => {
    await Category.delete({ users: new EqualOperator(res.locals.user.id) });
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

const totalCategory = async (res: express.Response): Promise<Category[]> => {
    try {

        const categories = await Category.find({
            where: { users: new EqualOperator(res.locals.user.id) }
        });

        return categories as Category[];
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