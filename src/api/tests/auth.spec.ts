import { test, expect } from "@playwright/test";
import { UserApiClient } from "@api/clients/UserApiClient";
import { validate, validators } from "@shared/helpers/ajvValidator";
import { ENV } from "@shared/config/env";
import testData from "@shared/data/reqres.json";

test.describe("API — Authentication", () => {
  let client: UserApiClient;

  test.beforeEach(async ({ request }) => {
    client = new UserApiClient(request, ENV.API_BASE_URL);
  });

  // ─── Login ──────────────────────────────────────────────────────────────────

  test("POST /login — should return 200 and token with valid credentials", async () => {
    const response = await client.login(testData.auth.validLogin);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const { valid, errors } = validate(body, validators.loginResponse);
    expect(errors).toHaveLength(0);
    expect(valid).toBe(true);
    expect(body.token).toBeTruthy();
  });

  test("POST /login — should return 400 when password is missing", async () => {
    const response = await client.login(
      testData.auth.missingPassword as { email: string; password: string }
    );

    expect(response.status()).toBe(400);

    const body = await response.json();
    const { valid } = validate(body, validators.errorResponse);
    expect(valid).toBe(true);
    expect(body.error).toBe("Missing password");
  });

  test("POST /login — should return 400 for unregistered email", async () => {
    const response = await client.login(testData.auth.unregisteredEmail);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBeTruthy();
  });

  // ─── Register ───────────────────────────────────────────────────────────────

  test("POST /register — should return 200 with id and token", async () => {
    const response = await client.register(testData.auth.validRegister);

    expect(response.status()).toBe(200);

    const body = await response.json();
    const { valid, errors } = validate(body, validators.registerResponse);
    expect(errors).toHaveLength(0);
    expect(valid).toBe(true);
    expect(body.id).toBeTruthy();
    expect(body.token).toBeTruthy();
  });

  test("POST /register — should return 400 when password is missing", async () => {
    const response = await client.register(
      testData.auth.missingPassword as { email: string; password: string }
    );

    expect(response.status()).toBe(400);

    const body = await response.json();
    const { valid } = validate(body, validators.errorResponse);
    expect(valid).toBe(true);
    expect(body.error).toBe("Missing password");
  });
});
