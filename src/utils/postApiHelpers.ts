import { APIRequestContext } from '@playwright/test';

export const createPost = async (request: APIRequestContext, token: string, userId: number, postData: any) => {
  const data = {
    ...postData,
    user_id: userId
  };
  return await request.post(`/public/v2/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data
  });
};
