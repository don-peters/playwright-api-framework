// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;

// API Endpoints
export const ENDPOINTS = {
  USERS: '/public/v2/users',
  POSTS: '/public/v2/posts',
  COMMENTS: '/public/v2/comments'
} as const;

// Test Data Constants
export const TEST_DATA = {
  USER_STATUSES: ['active', 'inactive'] as const,
  GENDERS: ['male', 'female'] as const,
  DEFAULT_TIMEOUT: 30000,
  RETRY_COUNT: 3
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_TOKEN: 'Invalid token',
  MISSING_FIELD: 'is invalid',
  UNAUTHORIZED: 'Authentication failed',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed'
} as const;

// Allure Labels
export const ALLURE_LABELS = {
  SEVERITY: {
    BLOCKER: 'blocker',
    CRITICAL: 'critical',
    NORMAL: 'normal',
    MINOR: 'minor',
    TRIVIAL: 'trivial'
  },
  FEATURES: {
    USER_MANAGEMENT: 'User Management',
    COMMENT_SYSTEM: 'Comment System',
    POST_MANAGEMENT: 'Post Management'
  }
} as const;
