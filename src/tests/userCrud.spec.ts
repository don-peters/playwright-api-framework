import { test, expect } from '@playwright/test';
import userSchema from '../schemas/user.schema.json';
import { validateSchema } from '../utils/validateSchema';
import { createUser, updateUser, deleteUser } from '../utils/userApiHelpers';
import { createUserData } from '../utils/userFactory';

// Type definitions for API responses
interface UserResponse {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

const token = process.env.GOREST_TOKEN || '';

test.describe('User CRUD Operations', () => {
  let createdUserId: number | undefined;

  test.beforeEach(async ({ request }) => {
    try {
      const newUser = createUserData();
      const response = await createUser(request, token, newUser);
      const body = await response.json() as UserResponse;
      expect(response.status(), 'User creation in setup should succeed').toBe(201);
      createdUserId = body.id;
    } catch (error) {
      console.error('Setup failed:', error);
      throw error;
    }
  });

  test.afterEach(async ({ request }) => {
    if (createdUserId) {
      try {
        await deleteUser(request, token, createdUserId);
      } catch (error) {
        console.warn(`Cleanup failed for user ${createdUserId}:`, error);
      }
      createdUserId = undefined;
    }
  });

  test.describe('Create Operations', () => {
    test('should create a new user with valid data and verify all fields', {
      annotation: [
        { type: 'feature', description: 'Create User' },
        { type: 'tag', description: 'User CRUD' },
        { type: 'severity', description: 'critical' }
      ]
    }, async ({ request }) => {
      // Arrange
      const newUser = createUserData();
      
      // Act
      const response = await createUser(request, token, newUser);
      const body = await response.json() as UserResponse;
      
      // Assert
      expect(response.status(), 'Create should return 201').toBe(201);
      expect(body.id, 'Created user should have an ID').toBeDefined();
      expect(body, 'Response should match input data').toMatchObject(newUser);
      
      // Validate schema
      const { valid, errors } = validateSchema(userSchema, body);
      expect(valid, `Schema validation failed: ${JSON.stringify(errors)}`).toBe(true);
      
      // Store ID for cleanup
      createdUserId = body.id;
    });
  });

  test.describe('Update Operations', () => {
    test('should successfully update user details', {
      annotation: [
        { type: 'feature', description: 'Update User' },
        { type: 'tag', description: 'User CRUD' },
        { type: 'severity', description: 'critical' }
      ]
    }, async ({ request }) => {
      // Arrange
      expect(createdUserId, 'User should be created in setup').toBeDefined();
      const updatedUser = {
        name: 'Updated Test User',
        status: 'inactive',
      };

      // Act
      const response = await updateUser(request, token, createdUserId!, updatedUser);
      const body = await response.json() as UserResponse;

      // Assert
      expect(response.status(), 'Update should return 200').toBe(200);
      expect(body, 'Response should match updated fields').toMatchObject(updatedUser);
      const { valid, errors } = validateSchema(userSchema, body);
      expect(valid, `Schema validation failed: ${JSON.stringify(errors)}`).toBe(true);
    });
  });

  test.describe('Delete Operations', () => {
    test('should delete the user and verify response', {
      annotation: [
        { type: 'feature', description: 'Delete User' },
        { type: 'tag', description: 'User CRUD' },
        { type: 'severity', description: 'critical' }
      ]
    }, async ({ request }) => {
      // Arrange
      expect(createdUserId, 'User should be created in setup').toBeDefined();

      // Act
      const response = await deleteUser(request, token, createdUserId!);
      
      // Assert
      expect(response.status(), 'Delete should return 204').toBe(204);
      expect(await response.text(), 'Delete response should be empty').toBe('');

      // Clear ID since we deleted it
      createdUserId = undefined;
    });
  });
});
