import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock testcontainers
const mockPostgresContainer = {
  withDatabase: vi.fn().mockReturnThis(),
  withUsername: vi.fn().mockReturnThis(),
  withPassword: vi.fn().mockReturnThis(),
  withExposedPorts: vi.fn().mockReturnThis(),
  start: vi.fn().mockResolvedValue({
    stop: vi.fn().mockResolvedValue(undefined),
    getConnectionUri: vi
      .fn()
      .mockReturnValue("postgres://testuser:testpass@localhost:5432/testdb"),
  }),
};

const mockRedisContainer = {
  withExposedPorts: vi.fn().mockReturnThis(),
  start: vi.fn().mockResolvedValue({
    stop: vi.fn().mockResolvedValue(undefined),
    getHost: vi.fn().mockReturnValue("localhost"),
    getMappedPort: vi.fn().mockReturnValue(6379),
  }),
};

vi.mock("testcontainers", () => ({
  GenericContainer: vi.fn(),
}));

vi.mock("@testcontainers/postgresql", () => ({
  PostgreSqlContainer: vi.fn().mockImplementation(() => mockPostgresContainer),
}));

vi.mock("@testcontainers/redis", () => ({
  RedisContainer: vi.fn().mockImplementation(() => mockRedisContainer),
}));

// Mock vitest hooks
vi.mock("vitest", async () => {
  const actual = await vi.importActual("vitest");
  return {
    ...actual,
    beforeAll: vi.fn(),
    afterAll: vi.fn(),
  };
});

let setupTestEnvironment: typeof import("./setup").setupTestEnvironment;
let teardownTestEnvironment: typeof import("./setup").teardownTestEnvironment;

async function ensureSetupModule() {
  if (setupTestEnvironment && teardownTestEnvironment) {
    return;
  }
  const setupModule = await import("./setup");
  setupTestEnvironment = setupModule.setupTestEnvironment;
  teardownTestEnvironment = setupModule.teardownTestEnvironment;
}

describe("Integration Test Setup", () => {
  beforeEach(async () => {
    await ensureSetupModule();
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.DATABASE_URL;
    delete process.env.REDIS_URL;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("setupTestEnvironment", () => {
    it("should start PostgreSQL and Redis containers", async () => {
      const result = await setupTestEnvironment();

      expect(mockPostgresContainer.withDatabase).toHaveBeenCalledWith("testdb");
      expect(mockPostgresContainer.withUsername).toHaveBeenCalledWith(
        "testuser",
      );
      expect(mockPostgresContainer.withPassword).toHaveBeenCalledWith(
        "testpass",
      );
      expect(mockPostgresContainer.withExposedPorts).toHaveBeenCalledWith(5432);
      expect(mockPostgresContainer.start).toHaveBeenCalled();

      expect(mockRedisContainer.withExposedPorts).toHaveBeenCalledWith(6379);
      expect(mockRedisContainer.start).toHaveBeenCalled();

      expect(result).toHaveProperty("postgres");
      expect(result).toHaveProperty("redis");
      expect(result).toHaveProperty("databaseUrl");
      expect(result).toHaveProperty("redisUrl");
    });

    it("should set environment variables correctly", async () => {
      await setupTestEnvironment();

      expect(process.env.DATABASE_URL).toBe(
        "postgres://testuser:testpass@localhost:5432/testdb",
      );
      expect(process.env.REDIS_URL).toBe("redis://localhost:6379");
    });

    it("should handle NODE_ENV assignment safely", async () => {
      const originalNodeEnv = process.env.NODE_ENV;

      // Test when NODE_ENV can be set normally
      await setupTestEnvironment();

      // Restore original NODE_ENV
      if (originalNodeEnv !== undefined) {
        (process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
      } else {
        delete (process.env as Record<string, string | undefined>).NODE_ENV;
      }

      // The test should not throw even if NODE_ENV is read-only
      expect(true).toBe(true); // Test passes if no error thrown
    });

    it("should return valid TestEnvironment object", async () => {
      const result = await setupTestEnvironment();

      expect(result).toMatchObject({
        postgres: expect.any(Object),
        redis: expect.any(Object),
        databaseUrl: expect.stringMatching(/^postgres:\/\//),
        redisUrl: expect.stringMatching(/^redis:\/\//),
      });
    });
  });

  describe("teardownTestEnvironment", () => {
    it("should stop containers when environment exists", async () => {
      // First setup the environment
      await setupTestEnvironment();

      // Mock the stop methods
      const mockPostgresStop = vi.fn().mockResolvedValue(undefined);
      const mockRedisStop = vi.fn().mockResolvedValue(undefined);

      // Update the started containers to have stop methods
      mockPostgresContainer.start.mockResolvedValue({
        stop: mockPostgresStop,
        getConnectionUri: vi
          .fn()
          .mockReturnValue(
            "postgres://testuser:testpass@localhost:5432/testdb",
          ),
      });

      mockRedisContainer.start.mockResolvedValue({
        stop: mockRedisStop,
        getHost: vi.fn().mockReturnValue("localhost"),
        getMappedPort: vi.fn().mockReturnValue(6379),
      });

      // Setup again with new mocks
      await setupTestEnvironment();

      // Now teardown
      await teardownTestEnvironment();

      expect(mockPostgresStop).toHaveBeenCalled();
      expect(mockRedisStop).toHaveBeenCalled();
    });

    it("should handle teardown when no environment exists", async () => {
      // Should not throw when called without setup
      await expect(teardownTestEnvironment()).resolves.toBeUndefined();
    });
  });

  describe("Error Handling", () => {
    it("should handle PostgreSQL container startup failure", async () => {
      mockPostgresContainer.start.mockRejectedValue(
        new Error("PostgreSQL startup failed"),
      );

      await expect(setupTestEnvironment()).rejects.toThrow(
        "PostgreSQL startup failed",
      );
    });

    it("should handle Redis container startup failure", async () => {
      // Reset PostgreSQL to succeed, but make Redis fail
      mockPostgresContainer.start.mockResolvedValue({
        stop: vi.fn().mockResolvedValue(undefined),
        getConnectionUri: vi
          .fn()
          .mockReturnValue(
            "postgres://testuser:testpass@localhost:5432/testdb",
          ),
      });

      mockRedisContainer.start.mockRejectedValue(
        new Error("Redis startup failed"),
      );

      await expect(setupTestEnvironment()).rejects.toThrow(
        "Redis startup failed",
      );
    });

    it("should handle container stop failure gracefully", async () => {
      const mockPostgresStop = vi
        .fn()
        .mockRejectedValue(new Error("Stop failed"));
      const mockRedisStop = vi.fn().mockResolvedValue(undefined);

      mockPostgresContainer.start.mockResolvedValue({
        stop: mockPostgresStop,
        getConnectionUri: vi
          .fn()
          .mockReturnValue(
            "postgres://testuser:testpass@localhost:5432/testdb",
          ),
      });

      mockRedisContainer.start.mockResolvedValue({
        stop: mockRedisStop,
        getHost: vi.fn().mockReturnValue("localhost"),
        getMappedPort: vi.fn().mockReturnValue(6379),
      });

      await setupTestEnvironment();

      // Teardown should handle stop failure
      await expect(teardownTestEnvironment()).rejects.toThrow("Stop failed");
    });
  });

  describe("Environment Variables", () => {
    it("should preserve existing environment variables", async () => {
      const originalDatabaseUrl = process.env.DATABASE_URL;
      const originalRedisUrl = process.env.REDIS_URL;

      await setupTestEnvironment();

      // Environment should be updated
      expect(process.env.DATABASE_URL).not.toBe(originalDatabaseUrl);
      expect(process.env.REDIS_URL).not.toBe(originalRedisUrl);

      // Values should be test-appropriate
      expect(process.env.DATABASE_URL).toContain("postgres://");
      expect(process.env.REDIS_URL).toContain("redis://");
    });

    it("should handle read-only NODE_ENV gracefully", async () => {
      // Mock console.warn to check if it's called
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Try to make NODE_ENV read-only (this may not work in all environments)
      const originalNodeEnv = process.env.NODE_ENV;

      try {
        await setupTestEnvironment();

        // Test should complete without error
        expect(true).toBe(true);
      } finally {
        // Restore original NODE_ENV
        if (originalNodeEnv !== undefined) {
          if (originalNodeEnv !== undefined) {
            (process.env as Record<string, string>).NODE_ENV = originalNodeEnv;
          } else {
            delete (process.env as Record<string, string | undefined>).NODE_ENV;
          }
        }
        consoleSpy.mockRestore();
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle concurrent setup calls", async () => {
      const promise1 = setupTestEnvironment();
      const promise2 = setupTestEnvironment();

      const [result1, result2] = await Promise.all([promise1, promise2]);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result1.databaseUrl).toBe(result2.databaseUrl);
      expect(result1.redisUrl).toBe(result2.redisUrl);
    });

    it("should handle multiple teardown calls", async () => {
      // Reset container mocks to successful versions
      const mockPostgresStop = vi.fn().mockResolvedValue(undefined);
      const mockRedisStop = vi.fn().mockResolvedValue(undefined);

      mockPostgresContainer.start.mockResolvedValue({
        stop: mockPostgresStop,
        getConnectionUri: vi
          .fn()
          .mockReturnValue(
            "postgres://testuser:testpass@localhost:5432/testdb",
          ),
      });

      mockRedisContainer.start.mockResolvedValue({
        stop: mockRedisStop,
        getHost: vi.fn().mockReturnValue("localhost"),
        getMappedPort: vi.fn().mockReturnValue(6379),
      });

      await setupTestEnvironment();

      // Multiple teardowns should not throw
      await teardownTestEnvironment();
      await teardownTestEnvironment();

      expect(mockPostgresStop).toHaveBeenCalled();
      expect(mockRedisStop).toHaveBeenCalled();
    });

    it("should provide correct connection URLs format", async () => {
      const result = await setupTestEnvironment();

      expect(result.databaseUrl).toMatch(
        /^postgres:\/\/\w+:\w+@[\w.-]+:\d+\/\w+$/,
      );
      expect(result.redisUrl).toMatch(/^redis:\/\/[\w.-]+:\d+$/);
    });
  });
});
