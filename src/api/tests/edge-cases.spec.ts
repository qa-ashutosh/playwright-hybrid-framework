import { test, expect } from "@playwright/test";
import { UserApiClient } from "@api/clients/UserApiClient";
import { ENV } from "@shared/config/env";
import testData from "@shared/data/reqres.json";

/**
 * Extended API edge cases — covers boundary conditions, response timing,
 * partial data handling, and sequential operation flows.
 */

test.describe("API — Extended Edge Cases", () => {
  let client: UserApiClient;

  test.beforeEach(async ({ request }) => {
    client = new UserApiClient(request, ENV.API_BASE_URL);
  });

  // ─── Boundary Conditions ────────────────────────────────────────────────────

  test("GET /users?page=0 — should handle out-of-range page gracefully", async () => {
    const response = await client.getUsers(0);
    // ReqRes returns 200 with empty data for out-of-range pages
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("GET /users?page=999 — should return empty data array for non-existent page", async () => {
    const response = await client.getUsers(999);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(0);
  });

  test("GET /users/0 — should return 404 for id zero", async () => {
    const response = await client.getUserById(0);
    expect(response.status()).toBe(404);
  });

  test("DELETE /users/:id — subsequent GET should still return data (fake API)", async () => {
    // ReqRes fakes deletes — verifying the API contract is stateless
    await client.deleteUser(testData.users.validId);
    const response = await client.getUserById(testData.users.validId);
    // Data still exists because ReqRes doesn't persist deletions
    expect(response.status()).toBe(200);
  });

  // ─── Response Timing ────────────────────────────────────────────────────────

  test("GET /users?delay=1 — should respond within acceptable timeout", async () => {
    const start = Date.now();
    const response = await client.getUsersWithDelay(1);
    const elapsed = Date.now() - start;

    expect(response.status()).toBe(200);
    // Should take at least 1 second but less than 10
    expect(elapsed).toBeGreaterThanOrEqual(1000);
    expect(elapsed).toBeLessThan(10000);
  });

  // ─── Payload Integrity ───────────────────────────────────────────────────────

  test("POST /users — createdAt timestamp should be a valid ISO 8601 date", async () => {
    const response = await client.createUser(testData.createUser);
    const body = await response.json();

    const date = new Date(body.createdAt);
    expect(date.toString()).not.toBe("Invalid Date");
    // Should be recent — within last 60 seconds
    expect(Date.now() - date.getTime()).toBeLessThan(60000);
  });

  test("PUT /users/:id — updatedAt should be more recent than a past timestamp", async () => {
    const before = new Date().toISOString();
    const response = await client.updateUser(
      testData.users.validId,
      testData.updateUser
    );
    const body = await response.json();

    const updatedAt = new Date(body.updatedAt);
    const beforeDate = new Date(before);
    expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeDate.getTime() - 1000);
  });

  test("PATCH /users/:id — should only return updated field and updatedAt", async () => {
    const response = await client.patchUser(testData.users.validId, {
      job: "Principal QA Architect",
    });
    const body = await response.json();

    expect(body.job).toBe("Principal QA Architect");
    expect(body.updatedAt).toBeTruthy();
    // name should NOT be in patch response since we didn't send it
    expect(body.name).toBeUndefined();
  });

  // ─── Sequential Operations ───────────────────────────────────────────────────

  test("create → update → delete sequence should all return correct status codes", async () => {
    // Create
    const createRes = await client.createUser(testData.createUser);
    expect(createRes.status()).toBe(201);
    const created = await createRes.json();
    expect(created.id).toBeTruthy();

    // Update using a fixed ID (ReqRes is stateless, ID from create is fake)
    const updateRes = await client.updateUser(
      testData.users.validId,
      testData.updateUser
    );
    expect(updateRes.status()).toBe(200);

    // Delete
    const deleteRes = await client.deleteUser(testData.users.validId);
    expect(deleteRes.status()).toBe(204);
  });

  test("multiple sequential GETs should return consistent total count", async () => {
    const res1 = await client.getUsers(1);
    const res2 = await client.getUsers(1);

    const body1 = await res1.json();
    const body2 = await res2.json();

    // Same endpoint, same page — total should be identical
    expect(body1.total).toBe(body2.total);
    expect(body1.total_pages).toBe(body2.total_pages);
  });

  // ─── Error Response Shape ────────────────────────────────────────────────────

  test("all 400 error responses should have an error string field", async () => {
    const responses = await Promise.all([
      client.login(testData.auth.missingPassword as { email: string; password: string }),
      client.register(testData.auth.missingPassword as { email: string; password: string }),
    ]);

    for (const response of responses) {
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(typeof body.error).toBe("string");
      expect(body.error.length).toBeGreaterThan(0);
    }
  });
});
