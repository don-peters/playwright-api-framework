import { test, expect } from '@playwright/test';
import { createUser, updateUser, deleteUser } from '../utils/userApiHelpers';
import { getUserById } from '../utils/getUserHelpers';

const token = process.env.GOREST_TOKEN || '';
const invalidToken = 'invalid_token';

// Helper for random email
function randomEmail() {
  return `negtest_${Date.now()}@example.com`;
}

test.describe('User API Negative & Edge Case Tests', () => {
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
    // First, create a valid user
    const validUser = {
      name: 'Edge Case User',
      gender: 'male',
      email: randomEmail(),
      status: 'active',
    };
    const createRes = await createUser(request, token, validUser);
    const userId = (await createRes.json()).id;
    // Now, try to update with invalid data
    const invalidUpdate = { email: 'not-an-email' };
    const updateRes = await updateUser(request, token, userId, invalidUpdate);
    expect(updateRes.status()).toBe(422);
    // Cleanup
    await deleteUser(request, token, userId);
  });

  test('DELETE /users/:id for non-existent user should return 404', async ({ request }) => {
    const response = await deleteUser(request, token, 999999999);
    expect(response.status()).toBe(404);
  });

  test('POST /users with duplicate email should return 422', async ({ request }) => {
    const email = randomEmail();
    const user = {
      name: 'Dup Email User',
      gender: 'male',
      email,
      status: 'active',
    };
    // Create user
    const res1 = await createUser(request, token, user);
    expect(res1.status()).toBe(201);
    // Try to create again with same email
    const res2 = await createUser(request, token, user);
    expect(res2.status()).toBe(422);
    // Cleanup
    const userId = (await res1.json()).id;
    await deleteUser(request, token, userId);
  });

  test('GET /users/:id with invalid token should return 401', async ({ request }) => {
    // First, create a valid user
    const validUser = {
      name: 'Auth Test User',
      gender: 'male',
      email: randomEmail(),
      status: 'active',
    };
    const createRes = await createUser(request, token, validUser);
    const userId = (await createRes.json()).id;
    // Try to fetch with invalid token
    const response = await getUserById(request, invalidToken, userId);
    expect(response.status()).toBe(401);
    // Cleanup
    await deleteUser(request, token, userId);
  });
});
