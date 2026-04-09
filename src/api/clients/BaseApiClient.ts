import { APIRequestContext, APIResponse } from "@playwright/test";

export class BaseApiClient {
  protected request: APIRequestContext;
  protected baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  private readonly defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "x-api-key": process.env.API_KEY ?? "",
  };

  protected async get(
    path: string,
    params?: Record<string, string | number>,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${path}`;
    // Only x-api-key, no Content-Type for GET
    const { "Content-Type": _, ...getDefaults } = this.defaultHeaders;
    return await this.request.get(url, {
      params,
      headers: { ...getDefaults, ...headers },
    });
  }

  protected async post(
    path: string,
    body: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${path}`;
    return await this.request.post(url, {
      data: body,
      headers: { ...this.defaultHeaders, ...headers },
    });
  }

  protected async put(
    path: string,
    body: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${path}`;
    return await this.request.put(url, {
      data: body,
      headers: { ...this.defaultHeaders, ...headers },
    });
  }

  protected async patch(
    path: string,
    body: Record<string, unknown>,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${path}`;
    return await this.request.patch(url, {
      data: body,
      headers: { ...this.defaultHeaders, ...headers },
    });
  }

  protected async delete(
    path: string,
    headers?: Record<string, string>,
  ): Promise<APIResponse> {
    const url = `${this.baseURL}${path}`;
    const { "Content-Type": _, ...deleteDefaults } = this.defaultHeaders;
    return await this.request.delete(url, {
      headers: { ...deleteDefaults, ...headers },
    });
  }
}
