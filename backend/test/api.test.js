const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const User = require("../src/models/User");
const Task = require("../src/models/Task");

let server;
let baseUrl;
let mongoServer;

const registerAndGetAuthCookie = async () => {
  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: `user-${Date.now()}-${Math.random()}@example.com`,
      password: "StrongPass1",
    }),
  });
  const data = await response.json();
  const cookieHeader = response.headers.get("set-cookie");

  assert.equal(response.status, 201);
  assert.equal(data.success, true);
  assert.ok(cookieHeader);
  assert.match(cookieHeader, /access_token=/);

  return cookieHeader.split(";")[0];
};

test.before(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  server = http.createServer(app);
  return new Promise((resolve) => {
    server.listen(0, () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

test.afterEach(async () => {
  await Promise.all([User.deleteMany({}), Task.deleteMany({})]);
});

test.after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

test("GET /health returns ok", async () => {
  const response = await fetch(`${baseUrl}/health`);
  const data = await response.json();

  assert.equal(response.status, 200);
  assert.equal(data.status, "ok");
});

test("register rejects invalid payload", async () => {
  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "a",
      email: "not-an-email",
      password: "123",
    }),
  });

  const data = await response.json();
  assert.equal(response.status, 400);
  assert.equal(data.success, false);
});

test("protected endpoint requires token", async () => {
  const response = await fetch(`${baseUrl}/api/v1/auth/me`);
  const data = await response.json();

  assert.equal(response.status, 401);
  assert.equal(data.success, false);
});

test("authenticated user can create and update own task", async () => {
  const authCookie = await registerAndGetAuthCookie();

  const createResponse = await fetch(`${baseUrl}/api/v1/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify({
      title: "Write integration test",
      description: "Cover task CRUD flow",
      status: "todo",
    }),
  });
  const created = await createResponse.json();

  assert.equal(createResponse.status, 201);
  assert.equal(created.success, true);
  assert.equal(created.data.title, "Write integration test");

  const updateResponse = await fetch(`${baseUrl}/api/v1/tasks/${created.data._id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify({ status: "done" }),
  });
  const updated = await updateResponse.json();

  assert.equal(updateResponse.status, 200);
  assert.equal(updated.success, true);
  assert.equal(updated.data.status, "done");
});

test("authenticated user can delete own task", async () => {
  const authCookie = await registerAndGetAuthCookie();

  const createResponse = await fetch(`${baseUrl}/api/v1/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify({
      title: "Temporary task",
      description: "Will be deleted",
      status: "todo",
    }),
  });
  const created = await createResponse.json();
  assert.equal(createResponse.status, 201);

  const deleteResponse = await fetch(`${baseUrl}/api/v1/tasks/${created.data._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: authCookie,
    },
    body: JSON.stringify({}),
  });
  const deleted = await deleteResponse.json();

  assert.equal(deleteResponse.status, 200);
  assert.equal(deleted.success, true);
  assert.equal(deleted.message, "Task deleted");

  const listResponse = await fetch(`${baseUrl}/api/v1/tasks`, {
    method: "GET",
    headers: {
      Cookie: authCookie,
    },
  });
  const listed = await listResponse.json();
  const stillExists = listed.data.some((task) => task._id === created.data._id);

  assert.equal(listResponse.status, 200);
  assert.equal(stillExists, false);
});
