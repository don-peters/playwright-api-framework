// Base interface for all API responses
export interface BaseApiResponse {
  id: number;
}

// Base interface for API helpers
export interface ApiHelper<T extends BaseApiResponse> {
  create(data: Partial<T>): Promise<any>;
  update(id: number, data: Partial<T>): Promise<any>;
  delete(id: number): Promise<any>;
  getById(id: number): Promise<any>;
}

// Standard API response wrapper
export interface ApiResponseWrapper<T> {
  data: T;
  meta?: {
    pagination?: {
      total: number;
      pages: number;
      page: number;
      limit: number;
    };
  };
}

// Test configuration interface
export interface TestConfig {
  baseUrl: string;
  token: string;
  timeout: number;
}

// Factory interface
export interface DataFactory<T> {
  create(overrides?: Partial<T>): T;
  createMany(count: number, overrides?: Partial<T>): T[];
}
