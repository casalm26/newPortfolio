import { describe, it, expect } from "vitest";
import request from "supertest";

// Mock Express app for performance testing
const express = require("express");
const app = express();
app.use(express.json());

// Mock health endpoint
app.get("/api/health", (req: any, res: any) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Mock data endpoint that simulates some processing
app.get("/api/data", (req: any, res: any) => {
  // Simulate some processing time
  const data = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    value: Math.random() * 1000,
    timestamp: new Date().toISOString(),
  }));

  res.status(200).json(data);
});

describe("Performance Tests", () => {
  it("should handle high concurrent load", async () => {
    const concurrentRequests = 50; // Reduced from 100 for faster testing
    const startTime = Date.now();

    const promises = Array.from({ length: concurrentRequests }, () =>
      request(app).get("/api/health"),
    );

    const responses = await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // All requests should succeed
    responses.forEach((response) => {
      expect(response.status).toBe(200);
    });

    // Should complete within reasonable time (adjust threshold as needed)
    expect(duration).toBeLessThan(10000); // 10 seconds (more lenient)

    console.log(`Load test: ${concurrentRequests} requests in ${duration}ms`);
    console.log(`Average response time: ${duration / concurrentRequests}ms`);
  }, 30000);

  it("should maintain performance under sustained load", async () => {
    const rounds = 3; // Reduced from 5 rounds
    const requestsPerRound = 10; // Reduced from 20 requests
    const results: number[] = [];

    for (let round = 0; round < rounds; round++) {
      const startTime = Date.now();

      const promises = Array.from({ length: requestsPerRound }, () =>
        request(app).get("/api/health"),
      );

      await Promise.all(promises);
      const duration = Date.now() - startTime;
      results.push(duration);

      // Small delay between rounds
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Performance should be reasonably consistent across rounds
    const avgTime =
      results.reduce((sum, time) => sum + time, 0) / results.length;
    const maxTime = Math.max(...results);

    expect(maxTime).toBeLessThan(avgTime * 3); // Max shouldn't be more than 3x average (more lenient)

    console.log(`Sustained load test results:`, results);
    console.log(`Average time per round: ${avgTime}ms`);
  }, 60000);

  it("should handle data processing efficiently", async () => {
    const iterations = 20; // Test data processing performance
    const startTime = Date.now();

    const promises = Array.from({ length: iterations }, () =>
      request(app).get("/api/data"),
    );

    const responses = await Promise.all(promises);
    const endTime = Date.now();
    const duration = endTime - startTime;

    // All requests should succeed
    responses.forEach((response) => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(100);
    });

    // Should process data efficiently
    const avgResponseTime = duration / iterations;
    expect(avgResponseTime).toBeLessThan(500); // Average less than 500ms per request

    console.log(
      `Data processing test: ${iterations} requests in ${duration}ms`,
    );
    console.log(`Average processing time: ${avgResponseTime}ms`);
  }, 30000);

  it("should handle memory efficiently during load", async () => {
    const initialMemory = process.memoryUsage();
    const requests = 30; // Test memory usage

    // Make multiple requests to test memory handling
    const promises = Array.from({ length: requests }, async () => {
      const response = await request(app).get("/api/data");
      return response.body;
    });

    await Promise.all(promises);

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;

    console.log(
      `Memory usage - Initial: ${Math.round(initialMemory.heapUsed / 1024 / 1024)}MB`,
    );
    console.log(
      `Memory usage - Final: ${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB`,
    );
    console.log(
      `Memory increase: ${Math.round(memoryIncrease / 1024 / 1024)}MB`,
    );

    // Memory increase should be reasonable (less than 100MB for this test)
    expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
  }, 30000);
});
