# ExpenElixir
Magical Money Manager
---
## Table of Content

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation Setup](#installation-setup)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Features

- **Security:**
  - User Authentication & Authorization (secure access control)
- **User Management:**
  - Email Verification (confirm user accounts)
  - Password Recovery (reset forgotten passwords)
- **Cloud Integration & Storage:**
  - AWS S3 (file uploads and storage)
  - Amazon RDS (scalable data storage)
- **Payment Processing:**
  - Stripe (secure payment transactions)
- **Notifications:**
  - Email Notifications (timely user communication)
- **Continuous Integration/Continuous Deployment:**
  - AWS CodePipeline (automated deployment workflows)
  - DockerHub
- **User Experience:**
  - Fast Filtering (efficient search capabilities)
- **Artificial Intelligence:**
  - ChatGPT Integration (AI-driven analytics and interactions)

## Tech Stack
- **Core Programming Languages:**
  - **TypeScript** (primary)
  - **JavaScript** (when necessary)
- **Server Environment:** Node.js
- **Primary Frameworks:** Express.js
- **Database Intergration:** TypeORM (for database management)
- **Payment Processing:** Stripe
- **Storage Solutions:** Amazon S3 (for static file hosting and management)
- **Continuous Integration/Continous Deployment:**
  - AWS CLI
  - DockerHub
 
## Installation setup

### Prerequisites

Before proceeding, ensure that you have `git` and `Node.js` with `npm` installed on your machine.

### Step 1: Clone the Repository

Clone the project repository to your local machine with the following command:

```bash
git clone git@github.com:V1rushB/ExpenElixir.git .
```

### Step 2: Install dependencies
```bash
npm install
```
### Step 3: Environment Configuration
The default port for the project is 2077. To change that just set up the `PORT` environment variable
when using docker ensure that you have mapped the ports correctly to avoid any run time issue.

### Step 4: Running the applicaiton
To run the application you can use this command:
```bash
npm run dev
```

### Deployment notes:
Remember to map the following:
Port `80` to the application's `PORT` for HTTP
Port `443` to the application's `PORT` for HTTPS

### Other notes.
you'll also need to setup other environment variables in order for the application to run properly.

# Documentation
## Register API Documentation

### Endpoint
`POST /user/register`

### Description
Endpoint for user registration.

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `username` | String | Username of the new user.   | Yes      |
| `password` | String | Password for the new user.  | Yes      |
| `email`    | String | Email address of the new user. | Yes   |
| `firstName`      | String | First name of the User | Yes   |
| `lastName`      | String | Last name of the User | Yes   |
| `phoneNumber`      | String | Phone number of the User | No   |
| `Currency`      | String | User's currency, default is USD | No   |

### Responses

- `201`: Created  
User has successfully registered and must verify his email.  
**Example Value**:  
```json
{
  "username": "v1rushb",
  "email": "Bashar@email.com",
  "password": "password",
  "firstName": "Bashar",
  "lastName": "Herbawi",
  "phoneNumber": "0599999999"
}
```
- `423`: Locked
User tried to access the service before verifying email

- `409`: Conflict
User tried to register using an existing email or username.

- `400`: Bad Request
User didn't provide the necessary fields to register.
**Example Value**:
```json
{
  "password": "password",
  "firstName": "Bashar",
  "lastName": "Herbawi",
  "phoneNumber": "0599999999"
}
```
```
email is Required.
username is Required.
``` 

- `500`: Internal Server Error

## Login API Documentation

### Endpoint
`POST /user/login`

### Description
Endpoint for user login.

### Request Body

#### Users

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `username` | String | Username of the new user.   | Yes      |
| `password` | String | Password for the new user.  | Yes      |

### IAM Users

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `username` | String | Username of the new user.   | Yes      |
| `password` | String | Password for the new user.  | Yes      |
| `IAMID`    | String | ID of creaetd user under some user's business | Yes   |

### Responses

- `200`: OK  
User has logged in.  
**Example Value**:  
```json
{
  "username": "v1rushb",
  "password": "password",
}
```
```json
{
  "username": "v1rushb",
  "password": "password",
  "IAMID": "012345678901"
}
```
```json
You have successfully logged in v1rushb!
```

- `423`: Locked
User tried to access the service before verifying email

- `409`: Conflict
User tried login but already logged in.

- `401`: Unauthorized
IAM user of an expired Business user tries to login
User tried to login with invalid username or password.

- `400`: Bad Request
User tried to log in when he is already logged in
**Example Value**:
```json
{
  "username": "v1rushA",
  "password": "password"
}
```
```json
Invalid credentials
```

- `500`: Internal Server Error

## logout API Documentation

### Endpoint
`POST /user/logout`

### Description
Endpoint for user logout.

### Request Body

Empty Body

### Responses

- `200`: OK
User logged out successfully.
**Example Value**:
```json
{

}
```

```json
You have been logged out. See you soon v1rushb!
```

```json
You have successfully logged in v1rushb!
```

- `423`: Locked
User tried to access the service before verifying email

- `409`: Conflict
User tried login but already logged in.

- `401`: Unauthorized
User tried to logout without being logged in.

- `500`: Internal Server Error


## User Balance API Documentation

### Endpoint
`GET /user/balance`

### Description
Endpoint for getting user balance.
this will send the user a number which represents current balance.

### Request Body

Empty body.

### Responses

- `200`: OK
User successfully recieved his balance.
**Example Value**:  
```json
{
}
```
```json
{
Your total income is: 400000 USD
}
```
- `401`: Unauthorized
User is not logged in.

- `500`: Internal Server Error


## Upgrade User to Business API Documentation

### Endpoint
`POST /user/upgrade-to-business`

### Description
Endpoint for upgrading a normal user to a business user.

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `card` | number | number of the user's credit cards   | Yes      |

### Responses

- `200`: OK
Payment succeeded
**Example Value**:
```json
{
  "card": "2"
}
```

```json
Payment succeeded
```

- `400`: Bad request
User tried to upgrade to business but already a business user.
Card expired
Insufficient funds
Payment failed.
- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to upgrade without being logged in.
IAM user tried to upgrade.


- `500`: Internal Server Error


## delete account API Documentation

### Endpoint
`DELETE /user/delete-account`

### Description
Endpoint for a user to delete their account.

### Request Body

Empty body

### Responses

- `200`: OK
Account deletion succeeded
**Example Value**:
```json
{

}
```

```json
Your account has been deleted successfully.
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in


- `500`: Internal Server Error


## Reset password API Documentation

### Endpoint
`POST /user/reset-password`

### Description
Endpoint for a user to reset password.

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `email` | string | Forgotten password user's email   | Yes      |
| `newPassword` | string | New password   | Yes      |

### Responses

- `200`: OK
Email has been sent
**Example Value**:
```json
{
  "email": "Bashar@emai.com"
  "newPassword": "ASD@!#%%lg^SDZC&sd*FDdas^S"
}
```

```json
Please check your mailbox for to continue in resetting your passwrd.
```

- `400`: Bad request
Email not provided
Password not provided
Old password is the same as new password
weak password.

- `404`: Not found
User not found

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error


## Update user info password API Documentation

### Endpoint
`PUT /user`

### Description
Endpoint for a user to update his information.

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `username` | String | Username of the new user.   | Yes      |
| `password` | String | Password for the new user.  | Yes      |
| `email`    | String | Email address of the new user. | Yes   |
| `firstName`      | String | First name of the User | Yes   |
| `lastName`      | String | Last name of the User | Yes   |
| `phoneNumber`      | String | Phone number of the User | No   |
| `phoneNumber`      | String | User's currency, default is USD | No   |

### Responses

- `200`: OK
Email has been sent
**Example Value**:
```json
{
  "email": "Bashar@emai.com"
  "newPassword": "ASD@!#%%lg^SDZC&sd*FDdas^S"
}
```

```json
Please check your mailbox for to continue in resetting your passwrd.
```

- `400`: Bad request
Invalid password

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.



## Insert income API Documentation

### Endpoint
`POST /income`

### Description
Endpoint for a user to add a new income

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Income's title   | Yes      |             |
| `amount` | String | Income's amount  | Yes      |            |
| `incomeDate`    | String | Income's date | Yes  |             |
| `description`    | String | Income's description | No  |             |

### Responses

- `200`: OK
Income has been created
**Example Value**:
```json
{
  "title": "Footfill",
  "amount": "20000",
  "incomeDate": "2023-10-10T15:11:54.000Z",
  "description": "some income"
}
```

```json
You have successfully added a new income!
```

- `400`: Bad request
Empty body
Any empty attribute

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.


## Getting total user's income API Documentation

### Endpoint
`PUT /income/total`

### Description
Endpoint for a user to get their total income.

### Request Body

Empty body

### Responses

- `200`: OK
Income has been created
**Example Value**:
```json
{
}
```

```json
Total income: 40000
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.



# Get incomes API Documentation

### Endpoint
`get /income/total`

### Description
Endpoint for a user to get his incomes

### Request Body

Empty body

### Responses

- `200`: OK
will send total income
**Example Value**:
```json
{
}
```

```json
Total income: 40000 USD
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.



# Get incomes API Documentation

### Endpoint
`get /income`

### Description
Endpoint for a user to get his incomes

### Request Body

Empty body

### Responses

- `200`: OK
will return user's incomes
**Example Value**:
```json
{

}
```

```json
[
    {
        "id": "908fef0a-5a84-455e-8407-8d63d0ebd1e2",
        "title": "Footfill",
        "amount": 20000,
        "incomeDate": "2023-10-10T15:11:54.000Z",
        "description": "some income"
    }
]
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.


## delete all incomes API Documentation

### Endpoint
`DELETE /income/all-incomes`

### Description
Endpoint for a user to delete all their incomes

### Request Body

Empty body

### Responses

- `200`: OK
All incomes will be deleted.
**Example Value**:
```json
{
}
```

```json
You have successfully deleted all incomes!
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.


## delete an income API Documentation

### Endpoint
`DELETE /income/:id`

### Description
Endpoint for a user to delete all their incomes

### Request Params

id : string

### Responses

- `200`: OK
The income with specified ID will be deleted
**Example Value**:
```json
{
}
```

```json
You have successfully deleted the income with id: c0bbbf41-18aa-48d8-b9b4-859e6cd056cf
```
- `400`: Bad request
ID is required

- `404`: Not found
Income with specified ID wasn't found.

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.



## Update an income API Documentation

### Endpoint
`PUT /income`

### Description
Endpoint for a user to add a new income

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Income's title   | Yes      |             |
| `amount` | String | Income's amount  | Yes      |            |
| `incomeDate`    | String | Income's date | Yes  |             |
| `description`    | String | Income's description | No  |             |

### Responses

- `200`: OK
Income has been modified
**Example Value**:
```json
{
  "title": "Footfill",
  "amount": "40000",
  "incomeDate": "2023-10-10T15:11:54.000Z",
  "description": "some income"
}
```

```json
You have successfully modified your income.
```

- `400`: Bad request
Empty body
Any empty attribute

- `404`: Not found
Income with specified id wasn't found.

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Insert an Expense API Documentation

### Endpoint
`POST /expense`

### Description
Endpoint for a user to add a new expense

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Expense's title   | Yes      |             |
| `amount` | String | Expense's amount  | Yes      |            |
| `expenseDate`    | String | Expense's date | Yes  |             |
| `description`    | String | Expense's description | No  |             |
| `category`    | String | category id in which expense lies in | No  |             |
| `picURL`    | String | a picture attached to the Expense | No  |             |

### Responses

- `200`: OK
Expense has been created
**Example Value**:
```json
{
  "title": "very huge bill",
  "amount": "1002336",
  "expenseDate": "2023-10-10T15:11:54.000Z",
  "description": "a bill that costed me a lot",
  "category":"c2fb359b-3840-4c71-b2e6-aa41e77d5b9f"
}
```

```json
You have successfully added a new Expense!
```

- `400`: Bad request
Empty body
Any empty attribute

- `404`: Not found
Category not found.

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Get expenses API Documentation

### Endpoint
`GET /expense`

### Description
Endpoint for a user to get their expenses

### Request Body

Empty body

### Responses

- `200`: OK
Expenses has been sent to the user
**Example Value**:
```json
{
}
```

```json
[
    {
        "id": "31630012-77bf-4f52-9bbc-b2c0fe60de98",
        "title": "very huge bill",
        "amount": 1002336,
        "expenseDate": "2023-10-10T15:11:54.000Z",
        "description": "a bill that costed me a lot",
        "picURL": "http://default",
        "category": {
            "id": "c2fb359b-3840-4c71-b2e6-aa41e77d5b9f",
            "title": "USA",
            "description": "my cat bro",
            "budget": 100000,
            "totalExpenses": 2004672
        }
    },
    {
        "id": "46ef299c-fc26-42af-8cc9-c5929ed1c21b",
        "title": "very huge bill",
        "amount": 1002336,
        "expenseDate": "2023-10-10T15:11:54.000Z",
        "description": "a bill that costed me a lot",
        "picURL": "http://default",
        "category": {
            "id": "c2fb359b-3840-4c71-b2e6-aa41e77d5b9f",
            "title": "USA",
            "description": "my cat bro",
            "budget": 100000,
            "totalExpenses": 2004672
        }
    }
]
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Get total expenses amount API Documentation

### Endpoint
`GET /expense/total`

### Description
Endpoint for a user to get the total of all expenses

### Request Body

Empty body

### Responses

- `200`: OK
successfully sent the user total expenses amount
**Example Value**:
```json
{
}
```

```json
Total expenses: 2004672
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Delete all expenses API Documentation

### Endpoint
`DELETE /expense/all-expenses`

### Description
Endpoint for a user to delete all expenses

### Request Body

Empty Body

### Responses

- `200`: OK
Deleted all user's expenses
**Example Value**:
```json
{
}
```

```json
You have successfully deleted all expenses!
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Delete an expense API Documentation

### Endpoint
`DELETE /expense/:id`

### Description
Endpoint for a user to delete a specified expense

### Request Params

id : string

### Responses

- `200`: OK
Deleted the specified expense
**Example Value**:
```json
{
}
```

```json
You have successfully deleted the expense with id: 0ba4ccff-035a-45de-bcb5-e842aee22139
```
- `400`: Bad request
Required ID

- `404`: Not found
Expense with specified ID wasn't found

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Delete an expense API Documentation

### Endpoint
`DELETE /expense/:id`

### Description
Endpoint for a user to delete a specified expense

### Request Params

id : string

### Responses

- `200`: OK
Deleted the specified expense
**Example Value**:
```json
{
}
```

```json
You have successfully deleted the expense with id: 0ba4ccff-035a-45de-bcb5-e842aee22139
```
- `400`: Bad request
Required ID

- `404`: Not found
Expense with specified ID wasn't found

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error




## Modify an Expense API Documentation

### Endpoint
`PUT /expense`

### Description
Endpoint for a user to modify and existing expense.

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Expense's title   | Yes      |             |
| `amount` | String | Expense's amount  | Yes      |            |
| `expenseDate`    | String | Expense's date | Yes  |             |
| `description`    | String | Expense's description | No  |             |
| `category`    | String | category id in which expense lies in | No  |             |
| `picURL`    | String | a picture attached to the Expense | No  |             |

### Responses

- `200`: OK
Expense has been modified.
**Example Value**:
```json
{
  "title": "very huge bill",
  "amount": "1002336",
  "expenseDate": "2023-10-10T15:11:54.000Z",
  "description": "a bill that costed me a lot",
  "category":"c2fb359b-3840-4c71-b2e6-aa41e77d5b9f"
}
```

```json
You have successfully modified the expense!
```

- `400`: Bad request
Empty body
Any empty attribute

- `404`: Not found
Expense wasn't found.
Category not found.

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Insert a category API Documentation

### Endpoint
`POST /category`

### Description
Endpoint for a user to add a new category

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Category's title   | Yes      |             |
| `budget` | String | Category's lookup limit budget   | Yes      |             
| `description`    | String | Category's description | No  |             |

### Responses

- `200`: OK
Category has been created
**Example Value**:
```json
{
    "title" : "USA",
    "description" : "my cat bro",
    "budget": "100000"
}
```

```json
You have successfully added a new category!
```

- `400`: Bad request
Empty body
Any empty attribute


- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Get all categories API Documentation

### Endpoint
`GET /category`

### Description
Endpoint for a user to get all categories

### Request Body

Empty body

### Responses

- `200`: OK
Categories will be sent to the user
**Example Value**:
```json
{
}
```

```json
[
    {
        "id": "aeddd75a-a399-46bb-b1d2-bb8ad43fce0b",
        "title": "Palestine",
        "description": "my cat bro",
        "budget": 100000,
        "totalExpenses": 0
    },
    {
        "id": "c2fb359b-3840-4c71-b2e6-aa41e77d5b9f",
        "title": "USA",
        "description": "my cat bro",
        "budget": 100000,
        "totalExpenses": 3007008
    }
]
```


- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Delete all categories API Documentation

### Endpoint
`DELETE /category/all-categories`

### Description
Endpoint for a user to delete all categories

### Request Body

Empty body

### Responses

- `200`: OK
All categories will be deleted.
**Example Value**:
```json
{
}
```

```json
You have successfully deleted all categories!
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Delete a category API Documentation

### Endpoint
`DELETE /category/:id`

### Description
Endpoint for a user to delete a specific category

### Request Params

id : string

### Responses

- `200`: OK
The specified category will be deleted
**Example Value**:
```json
{
}
```

```json
You have successfully deleted the category with id: d70a57f2-f6a0-4109-b6fd-4e4a6787d535!
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error


## Modify a category API Documentation

### Endpoint
`PUT /category/:id`

### Description
Endpoint for a user to modify a category

### Request Params

id : string

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Category's title   | Yes      |             |
| `budget` | String | Category's lookup limit budget   | Yes      |             
| `description`    | String | Category's description | No  |             |

### Responses

- `200`: OK
Category has been modified
**Example Value**:
```json
{
    "title" : "Palestine",
    "description" : "love <3",
    "budget": "100000"
}
```

```json
You have successfully modified the category!
```

- `400`: Bad request
Empty body
Any empty attribute

- `404`: Not found
Category with specified ID wasn't found.

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error

# Business API documentation

## Add a user API Documentation

### Endpoint
`POST /user/business/add-user`

### Description
Endpoint for a business user to add a user under their business 

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `username` | String | Username of the new user.   | Yes      |
| `password` | String | Password for the new user.  | Yes      |
| `email`    | String | Email address of the new user. | Yes   |
| `firstName`      | String | First name of the User | Yes   |
| `lastName`      | String | Last name of the User | Yes   |
| `phoneNumber`      | String | Phone number of the User | No   |
| `Currency`      | String | User's currency, default is USD | No   |
### Responses

- `201`: Created
Descendant user has been created
**Example Value**:
```json
{
  "firstName": "Zain",
  "lastName": "Herbawi",
  "email": "cs.zain.herbawi@gmail.com",
  "username": "z1rushb",
  "password": "!@R4F324DSdFgh#@5%fg@j#FSDFasd2",
  "phoneNumber": "05999999245"
}
```

```json
z1rushb has been successfully added to your business. A verification email has been sent to cs.zain.herbawi@gmail.com!
```

- `400`: Bad request
Empty body
Any empty attribute


- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.
IAM or Normal users tried to access.

- `500`: Internal Server Error



## Get business's users API Documentation

### Endpoint
`GET /user/business/`

### Description
Endpoint for a business user to get all the users under their business. 

### Request Body

Empty

### Responses

- `200`: OK
Sends the business user all the users in their business including themselves.
**Example Value**:
```json
{

}
```

```json
{
[
    {
        "id": "5357e5e2-ce8b-470c-846d-d1848b83fa8c",
        "username": "z1rushb",
        "email": "cs.zain.herbawi@gmail.com",
        "password": "$2b$10$NCVYw3bkWTzq8wtGrl7GI.TSrQwZSraXLcbqpbYsrpXe/sCe/cAoS",
        "iamId": "1698492870296",
        "isVerified": true,
        "verificationToken": " ",
        "resetToken": null,
        "resetTokenExpiration": null,
        "newHashedPassword": null,
        "createdAt": "2023-10-28T15:34:30.384Z",
        "business": {
            "id": "394dc8e3-9e32-4782-89ee-e86e2e50491e",
            "businessName": "Basharr's Business",
            "rootUserID": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
        },
        "expenses": [],
        "categories": [],
        "incomes": [],
        "profile": {
            "id": "9b9ec30a-8938-4fde-be26-570577e1847d",
            "firstName": "Zain",
            "lastName": "Herbawi",
            "phoneNumber": "05999999245",
            "Currency": "USD",
            "role": "User",
            "subscription_date": null,
            "hasSentEmail": null
        }
    },
    {
        "id": "54a2d3d8-7e3f-4883-aa45-185ca059f905",
        "username": "v1rushbb",
        "email": "cs.basharr.herbawi@gmail.com",
        "password": "$2b$10$SxQKhUzY3SnU8njAFudx3u1sLgumWGfMlU7.GvIS/uM.DUtU/K/JG",
        "iamId": null,
        "isVerified": true,
        "verificationToken": " ",
        "resetToken": null,
        "resetTokenExpiration": null,
        "newHashedPassword": null,
        "createdAt": "2023-10-27T19:43:40.303Z",
        "business": {
            "id": "394dc8e3-9e32-4782-89ee-e86e2e50491e",
            "businessName": "Basharr's Business",
            "rootUserID": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
        },
        "expenses": [],
        "categories": [
            {
                "id": "f6f91e39-0f95-45e6-9b45-a594baed7644",
                "title": "Palestine",
                "description": "love <3",
                "budget": 100000,
                "totalExpenses": 0
            }
        ],
        "incomes": [
            {
                "id": "c0bbbf41-18aa-48d8-b9b4-859e6cd056cf",
                "title": "Footfill",
                "amount": 40000,
                "incomeDate": "2023-10-10T15:11:54.000Z",
                "description": "some income"
            }
        ],
        "profile": {
            "id": "6b39c160-feda-4c75-b519-2805fec9fbf0",
            "firstName": "Basharr",
            "lastName": "Herbawi",
            "phoneNumber": "0599999999",
            "Currency": "USD",
            "role": "Root",
            "subscription_date": "2023-10-28T11:34:26.000Z",
            "hasSentEmail": false
        }
    }
]
}
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.
IAM or Normal users tried to access.

- `500`: Internal Server Error



## Get business's balance API Documentation

### Endpoint
`GET /user/business/balance`

### Description
Endpoint for a business user to get total balance under their business. 

### Request Body

Empty

### Responses

- `200`: OK
Sends the business user all the users in their business including themselves.
**Example Value**:
```json
{

}
```

```json
Your business balance is: 40000
```

- `423`: Locked
User tried to access the service before verifying email

- `401`: Unauthorized
User tried to access without being logged in.
IAM or Normal users tried to access.

- `500`: Internal Server Error



## Add an income to a user API Documentation

### Endpoint
`POST /income/business/add-user-income`

### Description
Endpoint for a business user to add an income to any user under their business

### Request Params

id: string

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Income's title   | Yes      |             |
| `amount` | String | Income's amount  | Yes      |            |
| `incomeDate`    | String | Income's date | Yes  |             |
| `description`    | String | Income's description | No  |             |

### Responses

- `201`: Created
An income has been created and assigned to that user.
**Example Value**:
```json
{
  "title": "Footfill",
  "amount": "40000",
  "incomeDate": "2023-10-10T15:11:54.000Z",
  "description": "some income"
}
```

```json
You have successfully added a new income!
```

- `400`: Bad request
Any empty attribute


- `401`: Unauthorized
User tried to access without being logged in.
IAM or Normal users tried to access.

- `500`: Internal Server Error



## Delete user's income API Documentation

### Endpoint
`DELETE /income/business/add-user-income`

### Description
Endpoint for a business user to delete an income of a user under their business.

### Request Params

id: string

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `userid` | String | target user's id   | Yes      |             |

### Responses

- `201`: Created
targets an exact income for a certain user and deletes it.
**Example Value**:
```json
{
    "userid": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
}
```

```json
You have successfully added a new income!
```

- `400`: Bad request
Any missing attribute

- `404`: Not found
Income not found.


- `401`: Unauthorized
User tried to access without being logged in.
IAM or Normal users tried to access.

- `500`: Internal Server Error




## Get business income to a user API Documentation

### Endpoint
`GET /income/business`

### Description
Endpoint for a business user to get all business's incomes.

### Request Body

Empty body.

### Responses

- `200`: OK
Sends the business user all business's incomes
**Example Value**:
```json
{

}
```

```json
[
    {
        "id": "99ae0e91-c14b-4b4a-a6b0-75667ebaa464",
        "title": "Footfill",
        "amount": 40000,
        "incomeDate": "2023-10-10T15:11:54.000Z",
        "description": "some income",
        "userId": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
    }
]
```


- `401`: Unauthorized
User tried to access without being logged in.
IAM or Normal users tried to access.

- `500`: Internal Server Error



## Modify income to a user API Documentation

### Endpoint
`PUT /income/business`

### Request Params

id: string

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Income's title   | Yes      |             |
| `amount` | String | Income's amount  | Yes      |            |
| `incomeDate`    | String | Income's date | Yes  |             |
| `description`    | String | Income's description | No  |             |
### Responses

- `200`: OK
Sends the business user all business's incomes
**Example Value**:
```json
{
  "title": "Footfill",
  "amount": "80000",
  "incomeDate": "2023-10-10T15:11:54.000Z",
  "description": "some income"
}
```

```json
You have successfully modified the income!
```
- `400`: Bad request
Missing attributes

- `401`: Unauthorized
User tried to access without being logged in.
IAM or Normal users tried to access.

- `404`: Not found
Specified user wasn't found.

- `500`: Internal Server Error



## Insert a user expense for API Documentation

### Endpoint
`POST /expense/business/add-user-expense`

### Description
Endpoint for a user to add a new expense for a user.

### Request Params

id: string => user's id.

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Expense's title   | Yes      |             |
| `amount` | String | Expense's amount  | Yes      |            |
| `expenseDate`    | String | Expense's date | Yes  |             |
| `description`    | String | Expense's description | No  |             |
| `category`    | String | category id in which expense lies in | No  |             |
| `picURL`    | String | a picture attached to the Expense | No  |             |

### Responses

- `200`: OK
Expense has been created
**Example Value**:
```json
{
  "title": "very huge bill",
  "amount": "1002336",
  "expenseDate": "2023-10-10T15:11:54.000Z",
  "description": "a bill that costed me a lot",
  "category":"c2fb359b-3840-4c71-b2e6-aa41e77d5b9f"
}
```

```json
You have successfully added a new Expense!
```

- `400`: Bad request
Empty body
Any missing attribute

- `404`: Not found
Category not found.
User not found.

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error




## Get business's expenses for API Documentation

### Endpoint
`GET /expense/business/`

### Description
Endpoint for a business user to get all expenses under their business.

### Request Body

Empty body.

### Responses

- `200`: OK
Expenses has been sent to the business user.
**Example Value**:
```json
{

}
```

```json
[
    {
        "id": "de553647-b32e-4797-9c8d-98ab89fac878",
        "title": "very huge bill",
        "amount": 1002336,
        "expenseDate": "2023-10-10T15:11:54.000Z",
        "description": "a bill that represents everything I have bought in the USA part 2",
        "picURL": "http://default",
        "category": {
            "id": "541ed414-f418-4a98-978b-4589e351d744",
            "title": "huge",
            "description": "huge",
            "budget": 300,
            "totalExpenses": 2004672
        },
        "userId": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
    }
]
```

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## delete user's expense for API Documentation

### Endpoint
`DELETE /expense/business/`

### Description
Endpoint for a business user to delete a user's expense. 

### Request Params

id: string => user's id.

### Request Params

id: string => expense ID

### Request Body

{
    "userID": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
}

### Responses

- `200`: OK
You have successfully deleted the expense!
**Example Value**:
```json
{
"
}
```

```json
You have successfully added a new Expense!
```

- `400`: Bad request
Empty body
Any missing attribute

- `404`: Not found
User not found.
Expense not found

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Filtered Search API Documentation

### Endpoint
`GET /expense/business/search`

### Description
Endpoint for a business user to delete a user's expense. 

### Request Query

search
minAmount
maxAmount
userID

### Responses

- `200`: OK
Sends filtered expenses accross all business.
**Example Value**:
```json
/expense/business/search?search=huge&userid=dd606543-9047-41cb-ab5b-a257069ce09c
```

```json
[
    {
        "id": "dd606543-9047-41cb-ab5b-a257069ce09c",
        "title": "very huge bill",
        "amount": 1002336,
        "expenseDate": "2023-10-10T15:11:54.000Z",
        "description": "a bill that represents everything I have bought in the USA part 2",
        "picURL": "http://default",
        "category": {
            "id": "541ed414-f418-4a98-978b-4589e351d744",
            "title": "huge",
            "description": "huge",
            "budget": 300,
            "totalExpenses": 2004672
        },
        "userId": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
    }
]
```

- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error



## Insert a category API Documentation

### Endpoint
`POST /category/business`

### Description
Endpoint for a business user to add a new category for a user in their business

### Request Params

useerID: string 

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Category's title   | Yes      |             |
| `budget` | String | Category's lookup limit budget   | Yes      |             
| `description`    | String | Category's description | No  |             |

### Responses

- `200`: OK
Category has been created and assigned to that user.
**Example Value**:
```json
{
    "title" : "USA",
    "description" : "my cat bro",
    "budget": "100000"
}
```

```json
You have successfully added a new category!
```

- `400`: Bad request
Any empty attribute


- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error




## Get categories API Documentation

### Endpoint
`GET /category/business`

### Description
Endpoint for a business user to get all categories in their business

### Request Body

Empty body.

### Responses

- `200`: OK
Sends business user all the categories.
**Example Value**:
```json
{

}
```

```json
[
    {
        "id": "541ed414-f418-4a98-978b-4589e351d744",
        "title": "huge",
        "description": "huge",
        "budget": 300,
        "totalExpenses": 2004672,
        "userId": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
    },
    {
        "id": "6408f54b-144b-4f28-b4ec-314ea073e35c",
        "title": "USA",
        "description": "my cat bro",
        "budget": 100000,
        "totalExpenses": 0,
        "userId": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
    },
    {
        "id": "f6f91e39-0f95-45e6-9b45-a594baed7644",
        "title": "Palestine",
        "description": "love <3",
        "budget": 100000,
        "totalExpenses": 0,
        "userId": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
    }
]
```


- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error




## Delete a category API Documentation

### Endpoint
`DELETE /category/business/:id`

### Description
Endpoint for a business user to delete a category for a user in their business. 

### Request Params

id: string represents 

category id (id): string 

### Request Body

userID

### Responses

- `200`: OK
Category has been created and assigned to that user.
**Example Value**:
```json
{
  "userid": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
}
```

```json
You have successfully deleted the category with id: 6408f54b-144b-4f28-b4ec-314ea073e35c!
```

- `400`: Bad request
Any missing attribute


- `401`: Unauthorized
User tried to access without being logged in.

- `404`: Not found
User not found
Category not found

- `500`: Internal Server Error




## Modify a category API Documentation

### Endpoint
`PUT /category/business`

### Description
Endpoint for a business user to add a new category for a user in their business

### Request Params

category ID: string 

### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `title` | String | Category's title   | Yes      |             |
| `budget` | String | Category's lookup limit budget   | Yes      |             
| `description`    | String | Category's description | No  |             |
| `userID`    | String | Target User's id | Yes  |             |

### Responses

- `200`: OK
Category has been modified.
**Example Value**:
```json
{
    "title" : "Palestine",
    "description" : "hi",
    "budget": "10000220",
    "userID": "54a2d3d8-7e3f-4883-aa45-185ca059f905"
}
```

```json
You have successfully modified the category!
```

- `400`: Bad request
Any empty attribute


- `401`: Unauthorized
User tried to access without being logged in.

- `500`: Internal Server Error




## Get a recommendation to fire API Documentation

### Endpoint
`GET /expense/business/analytics/recommend-fire`

### Description
Endpoint for a business user to get consultion of an AI model to fire somebody in the business, based on your business history.


### Request Body

Empty body.

### Responses

- `200`: OK
Response has been generated and sent to the user.
**Example Value**:
```json
{

}
```

```json
Name of the User: z1ruisbhb

Reason for firing: The user "z1ruisbhb" should be fired because their income-expense difference is 0, indicating that
they are not generating any profit or contributing positively to the business. It is essential for the business to
maintain a positive income-expense difference to sustain and grow.
```


- `401`: Unauthorized
User tried to access without being logged in.

- `404`: Not found
Business currently has 0 users (Business user excluded).

- `500`: Internal Server Error




## Get a recommendation to promote API Documentation

### Endpoint
`GET /expense/business/analytics/recommend-promote`

### Description
Endpoint for a business user to get consultion of an AI model to promoite somebody in the business, based on their business history.


### Request Body

Empty body.

### Responses

- `200`: OK
Response has been generated and sent to the user.
**Example Value**:
```json
{

}
```

```json
The user who should be given a promotion is v1rushb.

User v1rushb should be given a promotion because they have an income-expense difference of 15234. This indicates that they
have effectively managed their finances, ensuring that their income matches their expenses. Their ability to maintain a
balance between the money brought into the business and the money taken out demonstrates their proficiency in financial
management. Promoting them would not only recognize their skills but also motivate other employees to achieve similar
financial stability.
```


- `401`: Unauthorized
User tried to access without being logged in.

- `404`: Not found
Business currently has 0 users (Business user excluded).

- `500`: Internal Server Error




## Get analytics API Documentation

### Endpoint
`GET /expense/analytics/expenses-by-category`

### Description
Endpoint for a user to get a graph that will contain all categories and for each category will be the amount for all expenses lies in that category and an AI consultion that will give some advices for the future.


### Request Body

| Field      | Type   | Description                 | Required |
|------------|--------|-----------------------------|----------|
| `startDate` | Date | beggining of time interval   | Yes      |
| `endDate` | Date | Ending of time interval   | Yes      |

### Responses

- `200`: OK
Response has been generated and sent to the user.
**Example Value**:
```json
{

}
```

```json
Expense by Categroy:
huge | ================================================== 103500


Based on the given ASCII graph, it seems that the "huge" category has the highest expense with a value of 103,500. To
improve spending and increase profitability, it is essential to focus on this specific category. Analyzing the expenses
within the "huge" category and identifying areas where costs can be reduced or optimized would be a good starting point.
By carefully reviewing the expenditures associated with this category, you can identify potential cost-saving measures
and evaluate their impact on overall profitability. It may also be beneficial to explore opportunities for increasing
revenue or finding ways to generate additional income. Striving for efficiency in managing expenses while maximizing
revenue streams will help in achieving better financial results.
```
- `400`: Bad request
Any missing attribute

- `401`: Unauthorized
User tried to access without being logged in.


- `500`: Internal Server Error



## Get a prediction to promote API Documentation

### Endpoint
`GET /expense/analytics/predict-me`

### Description
Endpoint for a user to get a prediction from an AI model that analyze history and give a prediction for future spending.


### Request Body

Empty body.

### Responses

- `200`: OK
Response has been generated and sent to the user.
**Example Value**:
```json
{

}
```

```json
Based on the provided data, it seems that you spent 34,500 units of currency on October 10, 2023, three times in a row.
If this is the complete dataset, there is not enough information to predict your future spending accurately or calculate
the spending velocity.

To make predictions and determine spending velocity, more historical data covering a range of dates and amounts would be
required. Additionally, factors such as income, expenses, and personal financial goals should be taken into account to
provide a comprehensive analysis of your spending behavior and evaluate whether it is considered good or not.
```

- `401`: Unauthorized
User tried to access without being logged in.


- `500`: Internal Server Error

## Contributing
We sincerely appreciate your interest and contributions to our project. If you encounter any issues or have suggestions for enhancements, we welcome you to open an issue or submit a pull request. We strive for collaborative improvement and value each contribution, big or small. Please ensure that any pull requests follow the project's guidelines, are well-documented, and pass all tests. Your efforts help us build something truly remarkable are really appreciated.

## Haters will say it's a bad project. so if you're done reading we would really love for you to **STAR** this repo!
