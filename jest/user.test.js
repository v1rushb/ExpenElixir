import express from 'express';
import request from 'supertest';
import usersRouter from '../dist/routers/User.js';
import dataSource from '../dist/db/dataSource.js';
import dotenv from 'dotenv';
import { Users } from '../dist/entities/Users.js';
import { Category } from '../dist/entities/Category.js';
import { insertCategory } from '../dist/controllers/Category.js';
import CustomError from '../dist/utils/CustomError.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use('/users', usersRouter);
app.use(express.urlencoded({ extended: false }));


beforeAll(async () => {
  await dataSource.initialize().then(() => {
    console.log('Database connected, dude!');
  }).catch((err) => {
    console.log(err);
  });
}, 30000);

afterAll(async () => {
  await dataSource.destroy();
});

describe('POST /user/register', () => {
  it('should register a new user', async () => {
    const response = await request(app).post('/user/register').send({
      username: 'Bashar',
      password: 'Ga!R@!QSDBasDqw@#%%^DF',
      email: 'Bashar@gmail.com',
      firstName: 'Bashar',
      lastName: 'Herbawi',
      phoneNumber: '0599999999',
    });
    expect(response.status).toBe(201);
  });
});

it('should return 409 for duplicate username or email', async () => {
  const response = await request(app).post('/user/register').send({
    username: 'Bashar',
    password: 'Ga!R@!QSDBasDqw@#%%^DF',
    email: 'Bashar@gmail.com',
    firstName: 'Bashar',
    lastName: 'Herbawi',
    phoneNumber: '0599999999',
  });
  expect(response.status).toBe(409);
});

describe('POST /user/login', () => {
  it('should login the user', async () => {
    const response = await request(app)
      .post('/user/login')
      .send(JSON.stringify({
        username: 'Bashar',
        password: 'password',
      }));

    expect(response.status).toBe(200);
  });

  it('should return 401 for invalid login', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        username: 'Bashar',
        password: 'WrongPassword',
      });

    expect(response.status).toBe(401);
  });
});

describe('GET /expense', () => {
  it('should return 200 for successful get', async () => {
    const response = await request(app)
      .get('/expense');

    expect(response.status).toBe(200);
  });

  it('should return 500 for an internal error', async () => {
    const response = await request(app).get('/expense');
    expect(response.status).toBe(500);
  });
});


describe('insertCategory Controller', () => {
    it('should insert a new category', async () => {

      const mockPayload = {
        title: 'TestCategory',
        description: 'TestDescription',
      };
      const mockUser = new Users();
      mockUser.id = '1';

      const jwt = require('jsonwebtoken');
      jwt.decode = jest.fn().mockReturnValue({ id: mockUser.id });
      Category.create = jest.fn().mockReturnValue(mockPayload);
      Category.save = jest.fn();
      Users.findOne = jest.fn().mockResolvedValue(mockUser);
      Users.save = jest.fn();
  
      const req = {
        cookies: { token: 'valid-token' },
      }
  

      const result = await insertCategory(mockPayload, req);
  

      expect(jwt.decode).toHaveBeenCalledWith('valid-token', { json: true });
      expect(Category.create).toHaveBeenCalledWith(mockPayload);
      expect(Category.save).toHaveBeenCalledWith(mockPayload);
      expect(Users.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id }, relations: ['categories'] });
      expect(Users.save).toHaveBeenCalledWith(mockUser);
  
      expect(result).toEqual(mockPayload);
    });
  
    it('should throw a 404 error if the user is not found', async () => {
      const jwt = require('jsonwebtoken');
      jwt.decode = jest.fn().mockReturnValue({ id: 'invalid-user-id' });
  
      const mockPayload = {
        title: 'TestCategory',
        description: 'TestDescription',
      };
  
      const req = {
        cookies: { token: 'valid-token' },
      }
  
      try {
        await insertCategory(mockPayload, req);
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.statusCode).toBe(404);
      }
    });
  
    it('should throw a 500 error for an internal server error', async () => {
      const jwt = require('jsonwebtoken'); 
      jwt.decode = jest.fn().mockReturnValue({ id: 'valid-user-id' });
  
      const managerTransactionError = new Error('Transaction error');
      Users.manager.transaction = jest.fn().mockRejectedValue(managerTransactionError);
  
      const mockPayload = {
        title: 'TestCategory',
        description: 'TestDescription',
      };
  
      const req = {
        cookies: { token: 'valid-token' },
      }
  
      try {
        await insertCategory(mockPayload, req);
      } catch (error) {
        expect(error).toBeInstanceOf(CustomError);
        expect(error.statusCode).toBe(500);
      }
    });
  });