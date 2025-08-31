import { request } from '@playwright/test';

export class GoRestClient {
  private baseURL: string;
  private token: string;

  constructor(baseURL: string, token: string) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async get(path: string) {
    const res = await request.newContext({
      baseURL: 'https://gorest.co.in/public/v2',
      extraHTTPHeaders: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
    });
    return res.get(path);
  }

  // Add other HTTP methods as needed (post, put, delete)
}
