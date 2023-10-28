import express from 'express';
import { deleteAllIncomes } from '../controllers/Income.js';
import { CustomError } from '../CustomError.js';

export namespace Gen {
    export interface User extends Profile {
        username: string,
        email: string,
        password: string,
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
        category?: string,
        user: User,
        picFile?: Express.MulterS3.File,
        currencyType?: string
    }
    export interface Category {
        id: string,
        title: string,
        description: string,
        user: User,
        budget: number,
    }
    export interface Income {
        id: string,
        title: string,
        amount: number,
        incomeDate: Date,
        description: string,
        user: User,
        currencyType?: string,
    }
    export interface Profile {
        id: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        Currency: string,
        subscription: string,
    }

    export interface DecodedPayload {
        id: string,
        email: string,
        username: string,
    }

    export interface card {
        cardName: string,
        cardNumber: number,
        card_token: string,
        cardExp: Date,
        card_cvc: number,
        amount: number,
    }
    export interface currencyType {
        "AUD": number,
        "BGN": number,
        "BRL": number,
        "CAD": number,
        "CHF": number,
        "CNY": number,
        "CZK": number,
        "DKK": number,
        "EUR": number,
        "GBP": number,
        "HKD": number,
        "HRK": number,
        "HUF": number,
        "IDR": number,
        "ILS": number,
        "INR": number,
        "ISK": number,
        "JPY": number,
        "KRW": number,
        "MXN": number,
        "MYR": number,
        "NOK": number,
        "NZD": number,
        "PHP": number,
        "PLN": number,
        "RON": number,
        "RUB": number,
        "SEK": number,
        "SGD": number,
        "THB": number,
        "TRY": number,
        "USD": number,
        "ZAR": number,

    }
    export interface BaseRequest {
        req: express.Request,
    }

    export interface BaseResponse {
        res: express.Response,
    }
    export interface insertIncome extends Income, BaseResponse {}

    export interface deleteIncome  {
        id: string,
    }

    export interface modifyIncome extends Income { 
        id: string,
    }

    export interface insertExpense extends Gen.Expense, BaseResponse {}
    
    export interface deleteExpense {
        id: string
    }

    export interface deleteAllExpenses extends BaseResponse {}

    export interface totalExpenses extends BaseResponse {}

    export interface getExpenes extends BaseRequest, BaseResponse {}

    export interface getFilteredExpenses {
        searchQuery: string,
        minAmountQuery: string,
        maxAmountQuery: string,
        category: string,
    }

    export interface login extends BaseResponse {
        username: string,
        password: string,
        iamId: string | null,
    }
    export interface loginReturn {
        username: string,
        email: string,
        token: string
    }

    export interface insertUser extends Gen.User, BaseResponse {}


    export interface sendResetPasswordEmail {
        email: string,
        token: string,
    }

    export interface insertCategory extends Gen.Category, BaseResponse {}

    export interface deleteAllCategory extends BaseResponse {}

    export interface deleteCategory {
        id: string,
    }

    export interface totalCategory extends BaseResponse {}

    export interface modifyCategory extends Gen.Category {
        id: string,
    }

    export interface createUserUnderRoot extends Gen.User, BaseResponse {}

    export interface rootUserDescendant extends BaseResponse {
        descendantID: string,
    }

    export interface deleteDescendant extends BaseResponse {
        descendantID: string,
    }

    export interface businessUsers extends BaseResponse {}

    export interface businessBalance extends BaseResponse {}

    export interface addUserIncome extends Gen.Income, BaseResponse {
        userID: string,
    }

    export interface deleteUserIncome extends BaseResponse {
        incomeID: string,
        userID: string,
    }

    export interface businessIncome extends BaseResponse {}

    export interface totalBusinessIncome extends BaseResponse {}

    export interface modifyUserIncome extends Gen.Income, BaseResponse {
        incomeID: string,
        userID: string,
    }

    export interface addUserExpense extends Gen.Expense {
        userID: string,
        picFile: Express.MulterS3.File | undefined,
    }

    export interface deleteUserExpense {
        expenseID: string,
        userID: string,
    }
    
    export interface businessExpenses extends BaseResponse {}

    export interface totalBusinessExpenses extends BaseResponse {}

    export interface addUserCategory extends Gen.Category, BaseResponse {
        userID: string,
    }

    export interface deleteUserCategory {
        categoryID: string,
        userID: string,
        res: express.Response,
    }

    export interface businessCategories {
        res: express.Response,
    }

    export interface upgradeToBusiness extends BaseResponse {}

    export interface getFilteredBusinessExpenses {
        searchQuery: string,
        minAmountQuery: string,
        maxAmountQuery: string,
        userIDQuery: string,
    }

    export interface modifyUserExpense extends Gen.Expense, BaseResponse {
        expenseID: string,
        userID: string,
        picFile: Express.MulterS3.File | undefined,
    }

    export interface modifyUserCategory extends Gen.Category, BaseResponse {
        categoryID: string,
        userID: string,
    }
    
    export interface CustomErr extends Error, CustomError {}

    export interface getExpenesByCategory {
        startDate: string,
        endDate: string,
    }
    export interface getExpenesByCategoryReturn {
        category: string,
        amount: number,
    }

    export interface makeGraphicalData {
        category: string,
        amount: number,
    }

    export interface businessIncomeReturn {
        income: Income,
        userID: string,
    }
}