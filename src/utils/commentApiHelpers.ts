import { APIRequestContext } from '@playwright/test';
import { faker } from '@faker-js/faker';

export const createComment = async (request: APIRequestContext, token: string, postId: number, commentData: any) => {
  return await request.post(`/public/v2/posts/${postId}/comments`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: commentData
  });
};

export const updateComment = async (request: APIRequestContext, token: string, commentId: number, commentData: any) => {
  return await request.put(`/public/v2/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: commentData
  });
};

export const deleteComment = async (request: APIRequestContext, token: string, commentId: number) => {
  return await request.delete(`/public/v2/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const getCommentById = async (request: APIRequestContext, token: string, commentId: number) => {
  return await request.get(`/public/v2/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
