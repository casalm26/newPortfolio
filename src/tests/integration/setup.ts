import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';
import { beforeAll, afterAll } from 'vitest';

export interface TestEnvironment {
  postgres: StartedTestContainer;
  redis: StartedTestContainer;
  databaseUrl: string;
  redisUrl: string;
}

let testEnvironment: TestEnvironment;

export async function setupTestEnvironment(): Promise<TestEnvironment> {
  // Start PostgreSQL
  const postgres = await new PostgreSqlContainer('postgres:15-alpine')
    .withDatabase('testdb')
    .withUsername('testuser')
    .withPassword('testpass')
    .withExposedPorts(5432)
    .start();

  // Start Redis
  const redis = await new RedisContainer('redis:7-alpine')
    .withExposedPorts(6379)
    .start();

  const databaseUrl = postgres.getConnectionUri();
  const redisUrl = `redis://${redis.getHost()}:${redis.getMappedPort(6379)}`;

  testEnvironment = {
    postgres,
    redis,
    databaseUrl,
    redisUrl,
  };

  // Set environment variables
  process.env.DATABASE_URL = databaseUrl;
  process.env.REDIS_URL = redisUrl;
  process.env.NODE_ENV = 'test';

  return testEnvironment;
}

export async function teardownTestEnvironment(): Promise<void> {
  if (testEnvironment) {
    await testEnvironment.postgres.stop();
    await testEnvironment.redis.stop();
  }
}

// Global test setup
beforeAll(async () => {
  await setupTestEnvironment();
}, 60000); // 60 second timeout for container startup

afterAll(async () => {
  await teardownTestEnvironment();
});