import { APIRequestContext } from '@playwright/test';

const baseURL = 'https://gorest.co.in/public/v2';

export async function getUserList(request: APIRequestContext, token: string) {
  const response = await request.get(`${baseURL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
}

export async function getUserById(request: APIRequestContext, token: string, userId: number) {
  const response = await request.get(`${baseURL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response;
}
