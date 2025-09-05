// Custom error classes for better error handling
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public validationErrors: any[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TestSetupError extends Error {
  constructor(
    message: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'TestSetupError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}
