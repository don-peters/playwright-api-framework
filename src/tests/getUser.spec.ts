import { test, expect } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';
import { validateSchema } from '../utils/validateSchema';
import { getUserList, getUserById } from '../utils/getUserHelpers';

const token = process.env.GOREST_TOKEN || '';

test.describe('GET /users/:id', () => {
  test('should return a valid user', {
    annotation: [
      { type: 'feature', description: 'Get User By ID' },
      { type: 'epic', description: 'User API' },
      { type: 'tag', description: 'Get User' }
    ]
  }, async ({ request }) => {
    // Arrange
    const listResponse = await getUserList(request, token);
    const users = await listResponse.json();
    expect(Array.isArray(users) && users.length > 0).toBe(true);

    // Act & Assert: Find first accessible user
    let found = false;
    for (const user of users) {
      const response = await getUserById(request, token, user.id);
      if (response.status() === 200) {
        const body = await response.json();
        const { valid, errors } = validateSchema(userSchema, body);
        expect(valid, `Schema errors: ${JSON.stringify(errors)}`).toBe(true);
        expect(body).toHaveProperty('id', user.id);
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
  test.describe('GET /users', () => {
    test('should return a list of users', {
      annotation: [
        { type: 'feature', description: 'Get User List' },
        { type: 'epic', description: 'User API' },
        { type: 'tag', description: 'Get User' }
      ]
    }, async ({ request }) => {
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
