import express from 'express';

export namespace Gen {
    export interface User {
        id: string,
        firstName: string,
        lastName: string,
        username: string,
        email: string,
        password: string,
        phoneNumber: string,
        expenses: Expense[],
        categories: Category[],
        Income: Income[],
    }
    export interface Expense {
        id: string,
        title: string,
        amount: number,
        expenseDate: Date,
        description: string,
        category: Category,
        user: User,
        picURL: string
    }
    export interface Category {
        id: string,
        name: string,
        user: User,
    }
    export interface Income {
        id: string,
        title: string,
        amount: number,
        incomeDate: Date,
        description: string,
        user: User,
    }
}