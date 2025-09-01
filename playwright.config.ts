import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  reporter: [['allure-playwright', {
    detail: true,
    outputFolder: 'allure-results',
    suiteTitle: false,
    categories: ['allure-categories.json']
  }]],
  use: {
    baseURL: 'https://gorest.co.in/public/v2',
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.GOREST_TOKEN}`,
      'Content-Type': 'application/json',
    },
  },
});
