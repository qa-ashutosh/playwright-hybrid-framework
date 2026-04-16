import { test, expect } from "@playwright/test";
import { UserApiClient } from "@api/clients/UserApiClient";
import { validate, validators } from "@shared/helpers/ajvValidator";
import { ENV } from "@shared/config/env";
import testData from "@shared/data/reqres.json";
import {
  ReqResListResponse,
  ReqResUser,
  ReqResCreateUserResponse,
  ReqResUpdateUserResponse,
} from "@shared/types";

test.describe("API — Users CRUD", () => {
  let client: UserApiClient;

  test.beforeEach(async ({ request }) => {
    client = new UserApiClient(request, ENV.API_BASE_URL);
  });

  // ─── GET Users (list) ────────────────────────────────────────────────────────

  test("GET /users?page=1 — should return 200 with correct pagination meta", async () => {
    const response = await client.getUsers(testData.users.page1);

    expect(response.status()).toBe(200);

    const body: ReqResListResponse = await response.json();
    const { valid, errors } = validate(body, validators.listResponse);
    expect(errors).toHaveLength(0);
    expect(valid).toBe(true);
    expect(body.page).toBe(1);
    expect(body.per_page).toBe(testData.users.expectedPerPage);
    expect(body.data).toHaveLength(testData.users.expectedPerPage);
  });

  test("GET /users?page=2 — should return different set of users than page 1", async () => {
    const page1Response = await client.getUsers(1);
    const page2Response = await client.getUsers(2);

    const page1Body: ReqResListResponse = await page1Response.json();
    const page2Body: ReqResListResponse = await page2Response.json();

    const page1Ids = page1Body.data.map((u: ReqResUser) => u.id);
    const page2Ids = page2Body.data.map((u: ReqResUser) => u.id);

    const overlap = page1Ids.filter((id) => page2Ids.includes(id));
    expect(overlap).toHaveLength(0);
    expect(page2Body.page).toBe(2);
  });

  test("GET /users — each user object should match AJV schema", async () => {
    const response = await client.getUsers(1);
    const body: ReqResListResponse = await response.json();

    for (const user of body.data) {
      const { valid, errors } = validate(user, validators.userObject);
      expect(errors).toHaveLength(0);
      expect(valid).toBe(true);
    }
  });

  // ─── GET Single User ─────────────────────────────────────────────────────────

  test("GET /users/:id — should return 200 with correct user schema", async () => {
    const response = await client.getUserById(testData.users.validId);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const { valid, errors } = validate(body.data, validators.userObject);
    expect(errors).toHaveLength(0);
    expect(valid).toBe(true);
    expect(body.data.id).toBe(testData.users.validId);
  });

  test("GET /users/:id — should return 404 for non-existent user", async () => {
    const response = await client.getUserById(testData.users.invalidId);
    expect(response.status()).toBe(404);
  });

  // ─── GET with Delay ──────────────────────────────────────────────────────────

  test("GET /users?delay=3 — should eventually respond (timeout resilience)", async () => {
    const response = await client.getUsersWithDelay(3);
    expect(response.status()).toBe(200);

    const body: ReqResListResponse = await response.json();
    expect(body.data.length).toBeGreaterThan(0);
  });

  // ─── POST Create User ────────────────────────────────────────────────────────

  test("POST /users — should return 201 with id and createdAt", async () => {
    const response = await client.createUser(testData.createUser);

    expect(response.status()).toBe(201);

    const body: ReqResCreateUserResponse = await response.json();
    const { valid, errors } = validate(body, validators.createUserResponse);
    expect(errors).toHaveLength(0);
    expect(valid).toBe(true);
    expect(body.name).toBe(testData.createUser.name);
    expect(body.job).toBe(testData.createUser.job);
    expect(new Date(body.createdAt).toString()).not.toBe("Invalid Date");
  });

  // ─── PUT Update User ─────────────────────────────────────────────────────────

  test("PUT /users/:id — should return 200 with updatedAt timestamp", async () => {
    const response = await client.updateUser(
      testData.users.validId,
      testData.updateUser
    );

    expect(response.status()).toBe(200);

    const body: ReqResUpdateUserResponse = await response.json();
    const { valid, errors } = validate(body, validators.updateUserResponse);
    expect(errors).toHaveLength(0);
    expect(valid).toBe(true);
    expect(body.name).toBe(testData.updateUser.name);
    expect(new Date(body.updatedAt).toString()).not.toBe("Invalid Date");
  });

  // ─── PATCH Partial Update ────────────────────────────────────────────────────

  test("PATCH /users/:id — should return 200 with updated field and updatedAt", async () => {
    const response = await client.patchUser(testData.users.validId, {
      job: "Senior QA Lead",
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.job).toBe("Senior QA Lead");
    expect(body.updatedAt).toBeTruthy();
  });

  // ─── DELETE User ─────────────────────────────────────────────────────────────

  test("DELETE /users/:id — should return 204 with no content", async () => {
    const response = await client.deleteUser(testData.users.validId);

    expect(response.status()).toBe(204);

    const text = await response.text();
    expect(text).toBe("");
  });
});
