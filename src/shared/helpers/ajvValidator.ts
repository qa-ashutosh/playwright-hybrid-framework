import Ajv, { JSONSchemaType, ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import {
  ReqResUser,
  ReqResListResponse,
  ReqResLoginResponse,
  ReqResRegisterResponse,
  ReqResCreateUserResponse,
  ReqResUpdateUserResponse,
  ReqResErrorResponse,
} from "@shared/types";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// ─── Schema Definitions ───────────────────────────────────────────────────────

const userObjectSchema: JSONSchemaType<ReqResUser> = {
  type: "object",
  properties: {
    id:         { type: "number" },
    email:      { type: "string", format: "email" },
    first_name: { type: "string", minLength: 1 },
    last_name:  { type: "string", minLength: 1 },
    avatar:     { type: "string", format: "uri" },
  },
  required: ["id", "email", "first_name", "last_name", "avatar"],
  additionalProperties: true,
};

const listResponseSchema: JSONSchemaType<ReqResListResponse> = {
  type: "object",
  properties: {
    page:        { type: "number" },
    per_page:    { type: "number" },
    total:       { type: "number" },
    total_pages: { type: "number" },
    data: {
      type: "array",
      items: userObjectSchema,
    },
  },
  required: ["page", "per_page", "total", "total_pages", "data"],
  additionalProperties: true,
};

const loginResponseSchema: JSONSchemaType<ReqResLoginResponse> = {
  type: "object",
  properties: {
    token: { type: "string", minLength: 1 },
  },
  required: ["token"],
  additionalProperties: true,
};

const registerResponseSchema: JSONSchemaType<ReqResRegisterResponse> = {
  type: "object",
  properties: {
    id:    { type: "number" },
    token: { type: "string", minLength: 1 },
  },
  required: ["id", "token"],
  additionalProperties: true,
};

const createUserResponseSchema: JSONSchemaType<ReqResCreateUserResponse> = {
  type: "object",
  properties: {
    name:      { type: "string", minLength: 1 },
    job:       { type: "string", minLength: 1 },
    id:        { type: "string", minLength: 1 },
    createdAt: { type: "string", minLength: 1 },
  },
  required: ["name", "job", "id", "createdAt"],
  additionalProperties: true,
};

const updateUserResponseSchema: JSONSchemaType<ReqResUpdateUserResponse> = {
  type: "object",
  properties: {
    name:      { type: "string", minLength: 1 },
    job:       { type: "string", minLength: 1 },
    updatedAt: { type: "string", minLength: 1 },
  },
  required: ["name", "job", "updatedAt"],
  additionalProperties: true,
};

const errorResponseSchema: JSONSchemaType<ReqResErrorResponse> = {
  type: "object",
  properties: {
    error: { type: "string", minLength: 1 },
  },
  required: ["error"],
  additionalProperties: true,
};

// ─── Compiled Validators ──────────────────────────────────────────────────────

export const validators = {
  userObject:           ajv.compile(userObjectSchema),
  listResponse:         ajv.compile(listResponseSchema),
  loginResponse:        ajv.compile(loginResponseSchema),
  registerResponse:     ajv.compile(registerResponseSchema),
  createUserResponse:   ajv.compile(createUserResponseSchema),
  updateUserResponse:   ajv.compile(updateUserResponseSchema),
  errorResponse:        ajv.compile(errorResponseSchema),
};

// ─── Validate Helper ──────────────────────────────────────────────────────────

/**
 * Validates data against a compiled AJV schema.
 * Returns { valid, errors } — drop-in compatible with the old schemaValidator.
 */
export function validate<T>(
  data: unknown,
  validator: ValidateFunction<T>
): { valid: boolean; errors: string[] } {
  const valid = validator(data);
  const errors = validator.errors
    ? validator.errors.map(
        (e) => `${e.instancePath || "root"} ${e.message ?? "invalid"}`
      )
    : [];
  return { valid: valid as boolean, errors };
}
