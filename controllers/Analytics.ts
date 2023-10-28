import express from 'express';
import {Expense} from '../db/entities/Expense.js';
import {ChatGPTAPI, ChatMessage} from 'chatgpt';
import { Category } from '../db/entities/Category.js';
import { EqualOperator } from 'typeorm';
import { Gen } from '../@types/generic.js';


const getExpensesByCategory = async (startDate: Date, endDate: Date, res: express.Response): Promise<Gen.getExpenesByCategoryReturn[]>=> {
    const expensesByCategory: { [key: string]: number } = {};
    const result: {category: string, amount: number}[] = [];

    const filteredExpenses = res.locals.user.expenses.filter((expense: Expense) => {
        const expenseDate = new Date(expense.expenseDate);
        return expenseDate >= startDate && expenseDate <= endDate;
      });

    filteredExpenses.forEach((expense: Expense)=> {
        if (expense.category) {
            if (expensesByCategory[expense.category.title]) {
                expensesByCategory[expense.category.title] += expense.amount;
            } else {
                expensesByCategory[expense.category.title] = expense.amount;
            }
        }
    });
    for(const [category,amount] of Object.entries(expensesByCategory)) {
        result.push({category,amount});
    }
    return result;
}

const isValidDate = (date: string): boolean => {
    return !isNaN(Date.parse(date));
}

const sortQueryByAmount = (result: Gen.getExpenesByCategoryReturn[]): Gen.getExpenesByCategoryReturn[]=> {
    return result.sort((a, b) => b.amount - a.amount);
}

const makeGraphicalData = (data: Gen.makeGraphicalData[]) => { // simple function for making the impossible graphical presentation of the data in a backend app ;O
    const maxValue = Math.max(...data.map(d => d.amount)); // just doin' some scales
    const unitValue = maxValue / 50;

    let graphicalData = 'Expense by Categroy:\n';
    const size = graphicalData.length;
    data.forEach(iterator => {
        const barLength = Math.floor(iterator.amount/ unitValue);
        const bar = '='.repeat(barLength);
        graphicalData += `${iterator.category.padEnd(20, ' ')} | ${bar} ${iterator.amount}\n`;
    });
    return graphicalData.length === size? '': graphicalData;
}

const getAdvice = async (graph : string)=> {
    if(!graph.length) {
        return "I can't give you advice without data";
    }
    else {
        const api = new ChatGPTAPI({apiKey: process.env.CHATGPTAPI_SECRET_KEY || ''});
        const res : ChatMessage = await api.sendMessage(`I will give you an ASCII graph. very easy for you to read. here are its properities: Category | =====(increasing '=' based on how much is the value of expenses for this category)===== amount (and after all the '=' you'll see the amount of spent money in this category) so I wish for you to analyze this graph and tell me breifly with a small paragraph how can if get better at spending money and gaining profit OR any general advice. I just want you to include your advice in the answer NOTHING else. here's the graph ${graph}`)
        return res.text.toString();
    }
}

const getPrediction = async (res: express.Response): Promise<string> => {
    const userId = res.locals.user.id;
    const api = new ChatGPTAPI({apiKey: process.env.CHATGPTAPI_SECRET_KEY || ''});

    const expenses: Expense[] = await Expense.find({
        select: ['expenseDate', 'amount'],
        where: { users: new EqualOperator(userId) },
        order: {
          expenseDate: 'ASC'
        }
    });
    const expensesString = expenses.map(expense => `${expense.expenseDate.toDateString()} - ${expense.amount}`).join('\n');
    const response: ChatMessage = await api.sendMessage("I will provide you with some data of this form: {date : amount spent during this date} and I want you to predict my spending. Here is the data: " + expensesString + " and I also want you to tell me my spending velocity. which is avg of how much I spent during this time interval and tell me if it's good or not. if I didn't provide you with any data just say 'I cannot do any action without data'");

    return response.text.toString();
}

export {
    getExpensesByCategory,
    isValidDate,
    sortQueryByAmount,
    makeGraphicalData,
    getAdvice,
    getPrediction,
}