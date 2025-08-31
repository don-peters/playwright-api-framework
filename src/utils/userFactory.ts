// User data factory for tests
export function createUserData(overrides = {}) {
  const timestamp = Date.now();
  return {
    name: 'Test User',
    gender: 'male',
    email: `testuser_${timestamp}@example.com`,
    status: 'active',
    ...overrides,
  };
}
