import express from 'express';
import dataSource from "../db/dataSource.js";
import { Category } from "../db/entities/Category.js";
import jwt from 'jsonwebtoken';
import { Users } from '../db/entities/Users.js';
import { Gen } from '../@types/generic.js';
import { CustomError } from '../CustomError.js';
import { EqualOperator } from 'typeorm';


const insertCategory = async (payload: Gen.Category, res: express.Response): Promise<void> => {
    try {
        return dataSource.manager.transaction(async trans => {

            const newCategory = Category.create({
                title: payload.title, description: payload.description,budget: payload.budget,
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
    catch (err: any) {
        if (err.code?.includes('ER_DUP_ENTRY'))
            throw new CustomError(`Category with title: ${payload.title} already exists!`, 409);
        throw new CustomError(`Internal Server Error`, 500);
    }
}

const deleteAllCategory = async (res: express.Response) => {
    await Category.delete({ users: new EqualOperator(res.locals.user.id) });
}

const deleteCategory = async (payload: Gen.deleteCategory): Promise<string> => {
    try {
        const {id} = payload;
        const category = await Category.findOne({ where: { id: id } });
        if (!category)
            throw new CustomError(`category with id: ${id} was not found!`, 404);
        const categoryName = category.title;
        await Category.remove(category);
        return categoryName;
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

const modifyCategory = async (payload: Gen.modifyCategory, res: express.Response): Promise<void> => {
    try {
        const userCategories: Category[] = res.locals.user.categories
        if(!userCategories) 
            throw new CustomError(`No categories were found!`, 404);

        const category = userCategories.find(category => category.id === payload.id);
        if(!category)
            throw new CustomError(`Category with id: ${payload.id} was not found!`, 404);
        category.budget = payload.budget;
        category.title = payload.title;
        category.description = payload.description;
        await category.save();
        return res.locals.user.username;
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
    modifyCategory,
}