import { TestConfig } from '../types/interfaces';
import { AuthenticationError } from '../utils/errors';

export class Config {
  private static instance: Config;
  private config: TestConfig;

  private constructor() {
    this.config = {
      baseUrl: process.env.BASE_URL || 'https://gorest.co.in',
      token: this.getRequiredEnvVar('GOREST_TOKEN'),
      timeout: parseInt(process.env.TIMEOUT || '30000', 10)
    };
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value || value === 'your_gorest_token_here') {
      throw new AuthenticationError(`${name} environment variable is required. Please check your .env file.`);
    }
    return value;
  }

  get baseUrl(): string {
    return this.config.baseUrl;
  }

  get token(): string {
    return this.config.token;
  }

  get timeout(): number {
    return this.config.timeout;
  }

  getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }
}
