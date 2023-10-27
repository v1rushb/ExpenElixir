# ExpenElixir
Magical Money Manager
---

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
| `phoneNumber`      | String | User's currency, default is USD | No   |

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



## Insert an Expense API Documentation

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
