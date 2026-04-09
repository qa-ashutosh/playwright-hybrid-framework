import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  UI_BASE_URL: process.env.UI_BASE_URL || 'https://www.saucedemo.com',
  API_BASE_URL: process.env.API_BASE_URL || 'https://reqres.in',

  SAUCE_STANDARD_USER: process.env.SAUCE_STANDARD_USER || 'standard_user',
  SAUCE_PASSWORD: process.env.SAUCE_PASSWORD || 'secret_sauce',
  SAUCE_LOCKED_USER: process.env.SAUCE_LOCKED_USER || 'locked_out_user',
  SAUCE_PROBLEM_USER: process.env.SAUCE_PROBLEM_USER || 'problem_user',
};

export const TIMEOUTS = {
  DEFAULT: 30000,
  SHORT: 5000,
  LONG: 60000,
};
