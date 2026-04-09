import { APIRequestContext, APIResponse } from "@playwright/test";
import { BaseApiClient } from "./BaseApiClient";
import {
  ReqResCreateUserPayload,
  ReqResLoginPayload,
  ReqResRegisterPayload,
} from "@shared/types";

export class UserApiClient extends BaseApiClient {
  constructor(request: APIRequestContext, baseURL: string) {
    super(request, baseURL);
  }

  // ─── User CRUD ──────────────────────────────────────────────────────────────

  async getUsers(page?: number): Promise<APIResponse> {
    return await this.get("/api/users", page ? { page } : {});
  }

  async getUserById(id: number): Promise<APIResponse> {
    return await this.get(`/api/users/${id}`);
  }

  async createUser(payload: ReqResCreateUserPayload): Promise<APIResponse> {
    return await this.post(
      "/api/users",
      payload as unknown as Record<string, unknown>,
    );
  }

  async updateUser(
    id: number,
    payload: ReqResCreateUserPayload,
  ): Promise<APIResponse> {
    return await this.put(
      `/api/users/${id}`,
      payload as unknown as Record<string, unknown>,
    );
  }

  async patchUser(
    id: number,
    payload: Partial<ReqResCreateUserPayload>,
  ): Promise<APIResponse> {
    return await this.patch(
      `/api/users/${id}`,
      payload as unknown as Record<string, unknown>,
    );
  }

  async deleteUser(id: number): Promise<APIResponse> {
    return await this.delete(`/api/users/${id}`);
  }

  async getUsersWithDelay(delaySeconds: number): Promise<APIResponse> {
    return await this.get("/api/users", { delay: delaySeconds });
  }

  // ─── Auth ────────────────────────────────────────────────────────────────────

  async login(payload: ReqResLoginPayload): Promise<APIResponse> {
    return await this.post(
      "/api/login",
      payload as unknown as Record<string, unknown>,
    );
  }

  async register(payload: ReqResRegisterPayload): Promise<APIResponse> {
    return await this.post(
      "/api/register",
      payload as unknown as Record<string, unknown>,
    );
  }
}
