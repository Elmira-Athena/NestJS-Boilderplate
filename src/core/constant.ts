import { config } from 'dotenv';

config();

export const ROOT_DIR =
  process.env.NODE_ENV === 'production'
    ? `${process.cwd()}/dist`
    : `${process.cwd()}/src`;

export const validCurrencyCodes = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'SEK',
  'NZD',
  'VND',
];
