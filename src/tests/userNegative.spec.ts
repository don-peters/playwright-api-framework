import { test, expect } from '@playwright/test';
import { createUser, updateUser, deleteUser } from '../utils/userApiHelpers';
import { getUserById } from '../utils/getUserHelpers';
import { createUserData } from '../utils/userFactory';

// Type definitions for API responses
interface UserResponse {
  id: number;
  name: string;
  email: string;
  gender: string;
  status: string;
}

interface ErrorResponse {
  field?: string;
  message: string;
}

const token = process.env.GOREST_TOKEN || '';
const invalidToken = 'invalid_token';

let createdUserId: number | undefined;

test.describe('User API Error Handling', () => {
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

  test.describe('Authentication Errors', () => {
    test('should return 401 when using invalid token', async ({ request }) => {
      // Arrange
      const validUser = createUserData();
      const createRes = await createUser(request, token, validUser);
      const user = await createRes.json() as UserResponse;
      createdUserId = user.id;

      // Act
      const response = await getUserById(request, invalidToken, user.id);
      const errorBody = await response.json() as ErrorResponse;

      // Assert
      expect(response.status(), 'Invalid token should return 401').toBe(401);
      expect(errorBody.message).toContain('Invalid token');
    });
  });
  test.describe('Validation Errors', () => {
    test('should return 422 when creating user with missing required fields', async ({ request }) => {
      // Arrange
      const invalidUser = { name: 'No Email User' };

      // Act
      const response = await createUser(request, token, invalidUser);
      const errors = await response.json() as ErrorResponse[];

      // Assert
      expect(response.status(), 'Missing required fields should return 422').toBe(422);
      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('can\'t be blank')
        })
      );
    });

    test('should return 422 when updating user with invalid data', async ({ request }) => {
      // Arrange
      const validUser = createUserData();
      const createRes = await createUser(request, token, validUser);
      createdUserId = (await createRes.json() as UserResponse).id;
      const invalidUpdate = { email: 'not-an-email' };

      // Act
      const updateRes = await updateUser(request, token, createdUserId!, invalidUpdate);
      const errors = await updateRes.json() as ErrorResponse[];

      // Assert
      expect(updateRes.status(), 'Invalid email format should return 422').toBe(422);
      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: 'is invalid'
        })
      );
    });

    test('should return 422 when creating user with duplicate email', async ({ request }) => {
      // Arrange
      const user = createUserData();
      const firstResponse = await createUser(request, token, user);
      createdUserId = (await firstResponse.json() as UserResponse).id;
      
      // Act
      const duplicateResponse = await createUser(request, token, user);
      const errors = await duplicateResponse.json() as ErrorResponse[];

      // Assert
      expect(duplicateResponse.status(), 'Duplicate email should return 422').toBe(422);
      expect(errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('has already been taken')
        })
      );
    });
  });

  test.describe('Resource Not Found', () => {
    test('should return 404 when fetching non-existent user', async ({ request }) => {
      // Arrange
      const nonExistentId = 999999999;

      // Act
      const response = await getUserById(request, token, nonExistentId);
      const error = await response.json() as ErrorResponse;

      // Assert
      expect(response.status(), 'Non-existent user should return 404').toBe(404);
      expect(error.message).toContain('Resource not found');
    });

    test('should return 404 when deleting non-existent user', async ({ request }) => {
      // Arrange
      const nonExistentId = 999999999;

      // Act
      const response = await deleteUser(request, token, nonExistentId);
      const error = await response.json() as ErrorResponse;

      // Assert
      expect(response.status(), 'Deleting non-existent user should return 404').toBe(404);
      expect(error.message).toContain('Resource not found');
    });
  });
});
