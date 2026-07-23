import request from "supertest";
process.env.JWT_SECRET = "test_secret";
process.env.NODE_ENV = "test";

import app from "../src/app.js";
import { connect, closeDatabase, clearDatabase } from "./setup.js";

let token;

beforeAll(async () => {
  await connect();
});
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

const signupAndLogin = async () => {
  const res = await request(app).post("/api/auth/signup").send({
    name: "Expense Tester",
    email: "expense@example.com",
    password: "password123",
  });
  return res.body.token;
};

describe("Expense API", () => {
  beforeEach(async () => {
    token = await signupAndLogin();
  });

  it("creates a new expense", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Groceries", amount: 500, category: "Food", date: "2026-07-01" });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Groceries");
  });

  it("rejects expense creation without required fields", async () => {
    const res = await request(app)
      .post("/api/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Missing amount" });
    expect(res.statusCode).toBe(400);
  });

  it("lists expenses with pagination", async () => {
    await request(app).post("/api/expenses").set("Authorization", `Bearer ${token}`)
      .send({ title: "Coffee", amount: 150, category: "Food" });
    await request(app).post("/api/expenses").set("Authorization", `Bearer ${token}`)
      .send({ title: "Bus Ticket", amount: 40, category: "Transport" });

    const res = await request(app).get("/api/expenses?page=1&limit=10")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination.total).toBe(2);
  });

  it("updates an expense", async () => {
    const create = await request(app).post("/api/expenses").set("Authorization", `Bearer ${token}`)
      .send({ title: "Old Title", amount: 100, category: "Misc" });

    const res = await request(app)
      .put(`/api/expenses/${create.body.data._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("New Title");
  });

  it("deletes an expense", async () => {
    const create = await request(app).post("/api/expenses").set("Authorization", `Bearer ${token}`)
      .send({ title: "To Delete", amount: 20, category: "Misc" });

    const res = await request(app)
      .delete(`/api/expenses/${create.body.data._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  it("blocks access without a token", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.statusCode).toBe(401);
  });
});
