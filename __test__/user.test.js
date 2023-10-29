import express from "express";
import request from "supertest";
import "dotenv/config.js";
import usersRouter from "../dist/routers/User.js";
import categoryRouter from "../dist/routers/Category.js";
import dataSource, { initDB } from "../dist/db/dataSource.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/user", usersRouter);
app.use("/category", categoryRouter);
app.use(express.urlencoded({ extended: false }));

beforeAll(async () => {
  await initDB();
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("User Routes", () => {
  // it("should register a new user", async () => {
  //   const response = await request(app).post("/user/register").send({
  //     username: "test",
  //     password: "0123456789",
  //     email: "test@gmail.com",
  //     firstName: "Bashar",
  //     lastName: "Herbawi",
  //     phoneNumber: "0599999999",
  //   });
  //   expect(response.status).toBe(201);
  // });

  // it("should return 409 for duplicate username or email", async () => {
  //   const response = await request(app).post("/user/register").send({
  //     username: "test",
  //     password: "0123456789",
  //     email: "test@gmail.com",
  //     firstName: "Bashar",
  //     lastName: "Herbawi",
  //     phoneNumber: "0599999999",
  //   });
  //   expect(response.status).toBe(409);
  // });
  it("should login the user and save the token cookie", async () => {
    const response = await request(app).post("/user/login").send({
      username: "test",
      password: "0123456789",
    });

    expect(response.status).toBe(200);

    if (response.headers["set-cookie"]) {
      const cookies = response.headers["set-cookie"].reduce(
        (cookies, cookie) => {
          const [name, value] = cookie.split(";")[0].split("=");
          cookies[name] = value;
          return cookies;
        },
        {}
      );

      global.token = cookies.token;
    }
  });

  it("should return 401 for invalid login", async () => {
    const response = await request(app).post("/user/login").send({
      username: "test",
      password: "WrongPassword",
    });

    expect(response.status).toBe(401);
  });

  it("should delete user", async () => {
    const response = await request(app)
      .delete("/user/delete-account")
      .set("Cookie", `token=${global.token}`);
    console.log(response.error);
    console.log(response.body);
    expect(response.status).toBe(200);
  });
});
