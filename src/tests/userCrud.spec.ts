import { test, expect } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';
import { validateSchema } from '../utils/validateSchema';
import { createUser, updateUser, deleteUser } from '../utils/userApiHelpers';

const token = process.env.GOREST_TOKEN || '';

test.describe('User CRUD API', () => {
  let createdUserId: number;

  test('should create a new user', async ({ request }) => {
    const newUser = {
      name: 'Test User',
      gender: 'male',
      email: `testuser_${Date.now()}@example.com`,
      status: 'active',
    };
    const response = await createUser(request, token, newUser);
    const body = await response.json();
    expect(response.status()).toBe(201);
    const { valid, errors } = validateSchema(userSchema, body);
    expect(valid, `Schema errors: ${JSON.stringify(errors)}`).toBe(true);
    expect(body).toMatchObject(newUser);
    createdUserId = body.id;
  });

  test('should update the user', async ({ request }) => {
    const updatedUser = {
      name: 'Updated Test User',
      status: 'inactive',
    };
    const response = await updateUser(request, token, createdUserId, updatedUser);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toMatchObject(updatedUser);
  });

  test('should delete the user', async ({ request }) => {
    const response = await deleteUser(request, token, createdUserId);
    expect(response.status()).toBe(204);
  });
});
