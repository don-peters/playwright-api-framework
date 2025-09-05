import { test, expect } from '@playwright/test';
import commentSchema from '../schemas/comment.schema.json';
import { validateSchema } from '../utils/validateSchema';
import { createComment, updateComment, deleteComment } from '../utils/commentApiHelpers';
import { createCommentData } from '../utils/commentFactory';
import { createUser } from '../utils/userApiHelpers';
import { createUserData } from '../utils/userFactory';
import { createPost } from '../utils/postApiHelpers';
import { createPostData } from '../utils/postFactory';

const debugResponse = async (response: any) => {
  const status = response.status();
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return {
    status,
    text,
    json,
    headers: response.headers()
  };
};

// Type definitions for API responses
interface CommentResponse {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
}

const token = process.env.GOREST_TOKEN || '';

// Validate token exists
if (!token || token === 'your_gorest_token_here') {
  throw new Error('GOREST_TOKEN environment variable is required. Please check your .env file.');
}

test.describe('Comment CRUD Operations', () => {
  let userId: number;
  let postId: number;
  let createdCommentId: number | undefined;

  test.beforeAll(async ({ request }) => {
    try {
      // Create test user
      const newUser = createUserData();
      const userResponse = await createUser(request, token, newUser);
      
      const userDebug = await debugResponse(userResponse);
      if (userResponse.status() !== 201) {
        throw new Error(`Failed to create user. Debug info: ${JSON.stringify(userDebug, null, 2)}`);
      }
      
      userId = userDebug.json.id;
      console.log(`Created test user with ID: ${userId}`);

      // Create test post
      const newPost = createPostData(userId);
      const postResponse = await createPost(request, token, userId, newPost);
      
      const postDebug = await debugResponse(postResponse);
      if (postResponse.status() !== 201) {
        throw new Error(`Failed to create post. Debug info: ${JSON.stringify(postDebug, null, 2)}`);
      }
      
      postId = postDebug.json.id;
      console.log(`Created test post with ID: ${postId}`);
    } catch (error) {
      console.error('Test setup failed:', error);
      throw error;
    }
  });

  test.beforeEach(async ({ request }) => {
    try {
      // Create a new comment for each test
      const newComment = createCommentData(postId);
      const response = await createComment(request, token, postId, newComment);
      
      const debug = await debugResponse(response);
      if (response.status() !== 201) {
        throw new Error(`Failed to create comment. Debug info: ${JSON.stringify(debug, null, 2)}`);
      }
      
      createdCommentId = debug.json.id;
      console.log(`Created test comment with ID: ${createdCommentId}`);
    } catch (error) {
      console.error('Comment setup failed:', error);
      throw error;
    }
  });

  test.afterEach(async ({ request }) => {
    if (createdCommentId) {
      try {
        await deleteComment(request, token, createdCommentId);
      } catch (error) {
        console.warn(`Cleanup failed for comment ${createdCommentId}:`, error);
      }
      createdCommentId = undefined;
    }
  });

  test.describe('Create Operations', () => {
    test('should create a new comment with valid data', {
      annotation: [
        { type: 'feature', description: 'Create Comment' },
        { type: 'tag', description: 'Comment CRUD' },
        { type: 'severity', description: 'critical' }
      ]
    }, async ({ request }) => {
      // Arrange
      const newComment = createCommentData(postId);
      
      // Act
      const response = await createComment(request, token, postId, newComment);
      const body = await response.json() as CommentResponse;
      
      // Assert
      expect(response.status(), 'Create should return 201').toBe(201);
      expect(body.id, 'Created comment should have an ID').toBeDefined();
      expect(body, 'Response should match input data').toMatchObject(newComment);
      
      // Validate schema
      const { valid, errors } = validateSchema(commentSchema, body);
      expect(valid, `Schema validation failed: ${JSON.stringify(errors)}`).toBe(true);
      
      // Clean up this specific test comment
      await deleteComment(request, token, body.id);
    });
  });

  test.describe('Update Operations', () => {
    test('should successfully update comment details', {
      annotation: [
        { type: 'feature', description: 'Update Comment' },
        { type: 'tag', description: 'Comment CRUD' },
        { type: 'severity', description: 'critical' }
      ]
    }, async ({ request }) => {
      // Arrange
      expect(createdCommentId, 'Comment should be created in setup').toBeDefined();
      const updatedComment = {
        name: 'Updated Comment Name',
        body: 'Updated comment body with new content'
      };

      // Act
      const response = await updateComment(request, token, createdCommentId!, updatedComment);
      const body = await response.json() as CommentResponse;

      // Assert
      expect(response.status(), 'Update should return 200').toBe(200);
      expect(body, 'Response should match updated fields').toMatchObject(updatedComment);
      const { valid, errors } = validateSchema(commentSchema, body);
      expect(valid, `Schema validation failed: ${JSON.stringify(errors)}`).toBe(true);
    });
  });

  test.describe('Delete Operations', () => {
    test('should delete the comment and verify response', {
      annotation: [
        { type: 'feature', description: 'Delete Comment' },
        { type: 'tag', description: 'Comment CRUD' },
        { type: 'severity', description: 'critical' }
      ]
    }, async ({ request }) => {
      // Arrange
      expect(createdCommentId, 'Comment should be created in setup').toBeDefined();

      // Act
      const response = await deleteComment(request, token, createdCommentId!);
      
      // Assert
      expect(response.status(), 'Delete should return 204').toBe(204);
      expect(await response.text(), 'Delete response should be empty').toBe('');

      // Clear ID since we deleted it
      createdCommentId = undefined;
    });
  });
});
