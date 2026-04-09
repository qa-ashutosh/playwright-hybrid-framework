// ─── SauceDemo Types ────────────────────────────────────────────────────────

export type SauceUser = {
  username: string;
  password: string;
};

export type SortOption =
  | 'az'
  | 'za'
  | 'lohi'
  | 'hilo';

export type CheckoutInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

// ─── ReqRes Types ────────────────────────────────────────────────────────────

export type ReqResUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type ReqResListResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqResUser[];
};

export type ReqResSingleResponse = {
  data: ReqResUser;
};

export type ReqResLoginPayload = {
  email: string;
  password: string;
};

export type ReqResLoginResponse = {
  token: string;
};

export type ReqResRegisterPayload = {
  email: string;
  password: string;
};

export type ReqResRegisterResponse = {
  id: number;
  token: string;
};

export type ReqResCreateUserPayload = {
  name: string;
  job: string;
};

export type ReqResCreateUserResponse = {
  name: string;
  job: string;
  id: string;
  createdAt: string;
};

export type ReqResUpdateUserResponse = {
  name: string;
  job: string;
  updatedAt: string;
};

export type ReqResErrorResponse = {
  error: string;
};
