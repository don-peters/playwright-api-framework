import { APIRequestContext, APIResponse } from '@playwright/test';

const baseURL = 'https://gorest.co.in/public/v2';

export async function createUser(request: APIRequestContext, token: string, user: object): Promise<APIResponse> {
  return await request.post(`${baseURL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: user,
  });
}

export async function updateUser(request: APIRequestContext, token: string, userId: number, user: object): Promise<APIResponse> {
  return await request.put(`${baseURL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: user,
  });
}

export async function deleteUser(request: APIRequestContext, token: string, userId: number): Promise<APIResponse> {
  return await request.delete(`${baseURL}/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
}
