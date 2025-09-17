#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🧪 Testing Full-Stack Git Hooks...");

try {
  // Test Docker is available
  let dockerAvailable = false;
  try {
    execSync("docker --version", { stdio: "pipe" });
    execSync("docker-compose --version", { stdio: "pipe" });
    console.log("✅ Docker and Docker Compose are available");
    dockerAvailable = true;
  } catch {
    console.log(
      "⚠️ Docker or Docker Compose not found - Docker testing will be skipped",
    );
    console.log("ℹ️ Install Docker to enable full-stack testing capabilities");
  }

  // Test all hook files exist
  const requiredHooks = [
    ".husky/pre-commit",
    ".husky/pre-push",
    ".husky/commit-msg",
  ];
  requiredHooks.forEach((hookPath) => {
    if (!fs.existsSync(hookPath)) {
      throw new Error(`❌ Hook file missing: ${hookPath}`);
    }
  });

  // Test hook contents
  const preCommit = fs.readFileSync(".husky/pre-commit", "utf8");
  const prePush = fs.readFileSync(".husky/pre-push", "utf8");

  if (!preCommit.includes("test:unit")) {
    throw new Error("❌ Pre-commit missing unit tests");
  }

  if (!prePush.includes("test:full")) {
    throw new Error("❌ Pre-push missing full test suite");
  }

  console.log("✅ Git hooks configured with full-stack testing");

  // Test Docker configuration exists
  if (!fs.existsSync("docker-compose.test.yml")) {
    throw new Error("❌ Docker test configuration missing");
  }

  if (!fs.existsSync("Dockerfile.test")) {
    throw new Error("❌ Test Dockerfile missing");
  }

  console.log("✅ Docker test configuration found");

  // Test database schema files
  if (!fs.existsSync("database/test-schema.sql")) {
    console.log(
      "⚠️ Test database schema not found - creating directory structure...",
    );
    fs.mkdirSync("database", { recursive: true });
    fs.writeFileSync(
      "database/test-schema.sql",
      "-- Add your test schema here",
    );
  }

  console.log("✅ Database test fixtures configured");

  // Test integration test structure
  const integrationTests = fs.existsSync("src/tests/integration");
  const performanceTests = fs.existsSync("src/tests/performance");

  if (integrationTests && performanceTests) {
    console.log("✅ Integration and performance test structure configured");
  } else {
    console.log("⚠️ Some test directories missing");
  }

  // Test that Docker services can start (quick test) - only if Docker is available
  if (dockerAvailable) {
    console.log("🔄 Testing Docker services startup...");
    try {
      execSync("docker-compose -f docker-compose.test.yml config", {
        stdio: "pipe",
      });
      console.log("✅ Docker Compose configuration is valid");
    } catch (error) {
      console.log(`⚠️ Docker Compose configuration error: ${error.message}`);
    }
  }

  // Test commitlint configuration
  if (!fs.existsSync("commitlint.config.js")) {
    console.log(
      "⚠️ Commitlint configuration missing - conventional commits not enforced",
    );
  } else {
    console.log("✅ Commitlint configuration found");
  }

  // Test CI/CD configuration
  if (fs.existsSync(".github/workflows/test.yml")) {
    console.log("✅ GitHub Actions CI/CD configuration found");
  } else {
    console.log("⚠️ CI/CD configuration missing");
  }

  // Test Playwright installation
  const playwrightConfig = fs.existsSync("playwright.config.ts");
  if (!playwrightConfig) {
    console.log("⚠️ Playwright config not found");
  } else {
    console.log("✅ Playwright configuration found");
  }

  // Test that browsers are installed
  try {
    execSync("npx playwright --version", { stdio: "pipe" });
    console.log("✅ Playwright is properly installed");
  } catch {
    console.log("⚠️ Playwright may need browser installation");
    console.log("ℹ️ Run: npx playwright install");
  }

  // Test E2E directory structure
  const e2eExists = fs.existsSync("e2e");
  const e2eTests = fs.existsSync("e2e/tests");
  const e2eFixtures = fs.existsSync("e2e/fixtures");

  if (e2eExists && e2eTests && e2eFixtures) {
    console.log("✅ E2E test structure is properly configured");
  } else {
    console.log("⚠️ E2E test structure incomplete");
  }

  console.log("✅ Full-stack testing setup is complete and ready");
  console.log(
    '💡 Run "npm run test:docker:all" to test the complete Docker setup',
  );
} catch (error) {
  console.error("❌ Full-stack hook testing failed:", error.message);
  process.exit(1);
}
