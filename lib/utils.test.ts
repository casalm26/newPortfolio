import { describe, it, expect } from "vitest";
import { cn, generateSlug } from "./utils";

describe("utils", () => {
  describe("cn", () => {
    it("should combine class names correctly", () => {
      expect(cn("class1", "class2")).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      expect(cn("base", true && "conditional", false && "ignored")).toBe(
        "base conditional",
      );
    });

    it("should merge tailwind classes", () => {
      expect(cn("p-4", "p-6")).toBe("p-6");
    });

    it("should handle empty inputs", () => {
      expect(cn()).toBe("");
      expect(cn("")).toBe("");
    });

    it("should handle null and undefined", () => {
      expect(cn(null, undefined, "valid")).toBe("valid");
    });

    it("should handle arrays and objects", () => {
      expect(cn(["class1", "class2"])).toBe("class1 class2");
      expect(cn({ class1: true, class2: false })).toBe("class1");
    });
  });

  describe("generateSlug", () => {
    it("should convert titles to slugs", () => {
      expect(generateSlug("Hello World")).toBe("hello-world");
      expect(generateSlug("My Awesome Project!")).toBe("my-awesome-project");
    });

    it("should handle special characters", () => {
      expect(generateSlug("React & Next.js")).toBe("react-next-js");
      expect(generateSlug("foo---bar")).toBe("foo-bar");
    });

    it("should strip leading and trailing hyphens", () => {
      expect(generateSlug("--hello--")).toBe("hello");
      expect(generateSlug("!start!")).toBe("start");
    });
  });
});
