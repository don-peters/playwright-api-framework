import { test, expect } from '@playwright/test';
import { createUser, updateUser, deleteUser } from '../utils/userApiHelpers';
import { getUserById } from '../utils/getUserHelpers';
import { createUserData } from '../utils/userFactory';

const token = process.env.GOREST_TOKEN || '';
const invalidToken = 'invalid_token';

let createdUserId: number | undefined;

test.describe('User API Negative & Edge Case Tests', () => {
  test.afterEach(async ({ request }) => {
    if (createdUserId) {
      await deleteUser(request, token, createdUserId);
      createdUserId = undefined;
    }
  });
  test('GET /users/:id with non-existent ID should return 404', async ({ request }) => {
    const response = await getUserById(request, token, 999999999);
    expect(response.status()).toBe(404);
  });

  test('POST /users with missing required fields should return 422', async ({ request }) => {
    const newUser = { name: 'No Email User' };
    const response = await createUser(request, token, newUser);
    expect(response.status()).toBe(422);
  });

  test('PUT /users/:id with invalid data should return 422', async ({ request }) => {
  // Create a valid user before test
  const validUser = createUserData();
  const createRes = await createUser(request, token, validUser);
  createdUserId = (await createRes.json()).id;
  // Now, try to update with invalid data
  const invalidUpdate = { email: 'not-an-email' };
  const updateRes = await updateUser(request, token, createdUserId!, invalidUpdate);
  expect(updateRes.status()).toBe(422);
  });

  test('DELETE /users/:id for non-existent user should return 404', async ({ request }) => {
    const response = await deleteUser(request, token, 999999999);
    expect(response.status()).toBe(404);
  });

  test('POST /users with duplicate email should return 422', async ({ request }) => {
  const user = createUserData();
  // Create user
  const res1 = await createUser(request, token, user);
  expect(res1.status()).toBe(201);
  createdUserId = (await res1.json()).id;
  // Try to create again with same email
  const res2 = await createUser(request, token, user);
  expect(res2.status()).toBe(422);
  });

  test('GET /users/:id with invalid token should return 401', async ({ request }) => {
  // Create a valid user before test
  const validUser = createUserData();
  const createRes = await createUser(request, token, validUser);
  createdUserId = (await createRes.json()).id;
  // Try to fetch with invalid token
  const response = await getUserById(request, invalidToken, createdUserId!);
  expect(response.status()).toBe(401);
  });
});
