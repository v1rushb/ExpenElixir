import express from 'express';

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
        picURL?: string,
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
}