import { test, expect } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';
import { validateSchema } from '../utils/validateSchema';
import { getUserList, getUserById } from '../utils/getUserHelpers';

const token = process.env.GOREST_TOKEN || '';

test.describe('GET /users/:id', () => {
  test('should return a valid user', async ({ request }) => {
  // Arrange
  const listResponse = await getUserList(request, token);
  const users = await listResponse.json();
  expect(Array.isArray(users) && users.length > 0).toBe(true);
  const userId = users[0].id;

  // Act
  const response = await getUserById(request, token, userId);
  const body = await response.json();

  // Assert
  expect(response.status()).toBe(200);
  const { valid, errors } = validateSchema(userSchema, body);
  expect(valid, `Schema errors: ${JSON.stringify(errors)}`).toBe(true);
  expect(body).toHaveProperty('id', userId);
  });
  test.describe('GET /users', () => {
    test('should return a list of users', async ({ request }) => {
      // Act
      const response = await getUserList(request, token);
      const body = await response.json();

      // Assert
      expect(response.status()).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      for (const user of body) {
        const { valid, errors } = validateSchema(userSchema, user);
        expect(valid, `Schema errors: ${JSON.stringify(errors)}`).toBe(true);
      }
    });
  });
});
