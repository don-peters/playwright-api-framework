import { test, expect } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';
import { validateSchema } from '../utils/validateSchema';
import { createUser, updateUser, deleteUser } from '../utils/userApiHelpers';
import { createUserData } from '../utils/userFactory';

const token = process.env.GOREST_TOKEN || '';

test.describe('User CRUD API', () => {
  let createdUserId: number | undefined;

  test.beforeEach(async ({ request }) => {
    const newUser = createUserData();
    const response = await createUser(request, token, newUser);
    const body = await response.json();
    expect(response.status()).toBe(201);
    createdUserId = body.id;
  });

  test.afterEach(async ({ request }) => {
    if (createdUserId) {
      await deleteUser(request, token, createdUserId);
      createdUserId = undefined;
    }
  });

  test('should create a new user', {
    annotation: [
      { type: 'feature', description: 'Create User' },
      { type: 'tag', description: 'User CRUD' },
      { type: 'severity', description: 'critical' }
    ]
  }, async ({ request }) => {
    // User is created in beforeEach
    expect(createdUserId).toBeDefined();
  });

  test('should update the user', {
    annotation: [
      { type: 'feature', description: 'Update User' },
      { type: 'tag', description: 'User CRUD' },
      { type: 'severity', description: 'critical' }
    ]
  }, async ({ request }) => {
    expect(createdUserId).toBeDefined();
    const updatedUser = {
      name: 'Updated Test User',
      status: 'inactive',
    };
    const response = await updateUser(request, token, createdUserId!, updatedUser);
    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body).toMatchObject(updatedUser);
  });

  test('should delete the user', {
    annotation: [
      { type: 'feature', description: 'Delete User' },
      { type: 'tag', description: 'User CRUD' },
      { type: 'severity', description: 'critical' }
    ]
  }, async ({ request }) => {
    expect(createdUserId).toBeDefined();
    const response = await deleteUser(request, token, createdUserId!);
    expect(response.status()).toBe(204);
  });
});
