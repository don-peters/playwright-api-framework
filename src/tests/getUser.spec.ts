import { test, expect } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';
import { validateSchema } from '../utils/validateSchema';
import { getUserList, getUserById } from '../utils/getUserHelpers';

// Type definitions for API responses
interface UserResponse {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

interface UserListResponse extends Array<UserResponse> {}

const token = process.env.GOREST_TOKEN || '';

test.describe('User Retrieval Operations', () => {
  test.describe('Get Single User', () => {
  test('should return a valid user by ID', {
    annotation: [
      { type: 'feature', description: 'Get User By ID' },
      { type: 'epic', description: 'User API' },
      { type: 'tag', description: 'Get User' },
      { type: 'severity', description: 'critical' }
    ]
  }, async ({ request }) => {
    // Arrange
    const listResponse = await getUserList(request, token);
    const users = await listResponse.json() as UserListResponse;
    expect(users.length, 'User list should not be empty').toBeGreaterThan(0);

    // Act & Assert: Find first accessible user
    let foundValidUser = false;
    for (const user of users) {
      const response = await getUserById(request, token, user.id);
      
      if (response.status() === 200) {
        const body = await response.json() as UserResponse;
        
        // Validate response schema
        const { valid, errors } = validateSchema(userSchema, body);
        expect(valid, `Schema validation failed: ${JSON.stringify(errors)}`).toBe(true);
        
        // Validate user properties
        expect(body.id, 'User ID should match request').toBe(user.id);
        expect(body.name, 'User should have a name').toBeDefined();
        expect(body.email, 'User should have an email').toBeDefined();
        
        foundValidUser = true;
        break;
      }
    }
    expect(foundValidUser, 'Should find at least one accessible user').toBe(true);
  });
  });

  test.describe('Get User List', () => {
    test('should return a paginated list of users with valid data', {
      annotation: [
        { type: 'feature', description: 'Get User List' },
        { type: 'epic', description: 'User API' },
        { type: 'tag', description: 'Get User' },
        { type: 'severity', description: 'critical' }
      ]
    }, async ({ request }) => {
      // Act
      const response = await getUserList(request, token);
      const body = await response.json() as UserListResponse;

      // Assert
      expect(response.status(), 'List endpoint should return 200').toBe(200);
      expect(Array.isArray(body), 'Response should be an array').toBe(true);
      expect(body.length, 'Response should contain users').toBeGreaterThan(0);
      
      // Validate each user in the list
      for (const user of body) {
        const { valid, errors } = validateSchema(userSchema, user);
        expect(valid, `Schema validation failed for user ${user.id}: ${JSON.stringify(errors)}`).toBe(true);
        expect(user.id, 'Each user should have an ID').toBeDefined();
        expect(user.name, 'Each user should have a name').toBeDefined();
        expect(user.email, 'Each user should have an email').toBeDefined();
      }

      // Verify response headers
      const headers = response.headers();
      expect(headers['content-type'], 'Response should be JSON').toContain('application/json');
      expect(headers['x-pagination-total'], 'Pagination header should exist').toBeDefined();
    });
  });
});
