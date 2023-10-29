import { CustomError } from "../dist/CustomError.js";
import { validateUser, validateExpense } from "../dist/middlewares/Validate";

describe("validateUser Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        firstName: "Test",
        lastName: "test",
        email: "Test@gmail.com",
        username: "Test",
        password: "!@R4F324DSdFgh#@5%fg@j#FSDFasd2",
        phoneNumber: "059775566",
      },
    };

    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it("should return an error response for an invalid email", async () => {
    req.body.email = "invalid-email";

    await validateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Invalid email.");
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error response for a weak password", async () => {
    req.body.password = "weakpass";

    await validateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Password must be at least 10 characters and include at least one uppercase letter, one lowercase letter, and one number.");
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle an empty body and return a 500 status", async () => {
    const Required = "firstName";
    req.body[Required] = null;

    await validateUser(req, res, next);

    expect(res.send).toHaveBeenCalledWith(`${Required} is Required.`);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("validateExpense Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        title: "Test Expense",
        amount: 100.5,
        expenseDate: "2023-10-25",
      },
    };

    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };

    next = jest.fn();
  });

  it("should call next() for valid expense data", async () => {
    await validateExpense(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return an error response for missing required fields", async () => {
    req.body = {};

    await validateExpense(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "title is Required.\namount is Required.\nexpenseDate is Required."
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error response for a non-positive amount", async () => {
    req.body.amount = 0;

    await validateExpense(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Amount must be greater than 0.");
    expect(next).not.toHaveBeenCalled();
  });

  it("should handle an empty body and return a 400 status with CustomError", async () => {
    req.body = null;

    await validateExpense(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
  });
});
