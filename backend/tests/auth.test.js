import request from "supertest";
import { jest } from "@jest/globals";
process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

import app from "../src/app.js";
import { connect, closeDatabase, clearDatabase } from "./setup.js";

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe("Auth API", () => {
  it("signs up a new user", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "Anuj Mishra",
      email: "anuj@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe("anuj@example.com");
  });

  it("rejects duplicate email signup", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Anuj", email: "dup@example.com", password: "password123",
    });
    const res = await request(app).post("/api/auth/signup").send({
      name: "Anuj2", email: "dup@example.com", password: "password123",
    });
    expect(res.statusCode).toBe(409);
  });

  it("logs in with correct credentials", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Login User", email: "login@example.com", password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com", password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("rejects login with wrong password", async () => {
    await request(app).post("/api/auth/signup").send({
      name: "Wrong Pw", email: "wrongpw@example.com", password: "password123",
    });
    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpw@example.com", password: "nope",
    });
    expect(res.statusCode).toBe(401);
  });
});
