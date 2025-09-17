import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionContainer from "./SectionContainer";

describe("SectionContainer", () => {
  describe("normal use cases", () => {
    it("should render children correctly", () => {
      render(
        <SectionContainer>
          <div data-testid="child">Test content</div>
        </SectionContainer>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("should apply default narrow type", () => {
      render(
        <SectionContainer>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toHaveClass("container-narrow");
    });

    it("should apply specified type", () => {
      render(
        <SectionContainer type="wide">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toHaveClass("container-wide");
    });

    it("should apply custom className", () => {
      render(
        <SectionContainer className="custom-class">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toHaveClass("custom-class");
    });

    it("should combine type and className", () => {
      render(
        <SectionContainer type="ultrawide" className="custom-class">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toHaveClass("container-ultrawide");
      expect(section).toHaveClass("custom-class");
    });
  });

  describe("edge cases", () => {
    it("should handle multiple children", () => {
      render(
        <SectionContainer>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
        </SectionContainer>,
      );

      expect(screen.getByTestId("child1")).toBeInTheDocument();
      expect(screen.getByTestId("child2")).toBeInTheDocument();
    });

    it("should handle empty className", () => {
      render(
        <SectionContainer className="">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toHaveClass("w-full", "p-6", "container-narrow");
    });

    it("should handle null children gracefully", () => {
      render(
        <SectionContainer>
          {null}
          <div>Valid content</div>
        </SectionContainer>,
      );

      expect(screen.getByText("Valid content")).toBeInTheDocument();
    });

    it("should handle all container types", () => {
      const types = ["narrow", "wide", "ultrawide"] as const;

      types.forEach((type) => {
        const { unmount } = render(
          <SectionContainer type={type}>
            <div>Content for {type}</div>
          </SectionContainer>,
        );

        const section = document.querySelector("section");
        expect(section).toHaveClass(`container-${type}`);

        unmount();
      });
    });
  });

  describe("default classes", () => {
    it("should always have base classes", () => {
      render(
        <SectionContainer>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toHaveClass("w-full");
      expect(section).toHaveClass("p-6");
    });

    it("should maintain base classes with custom className", () => {
      render(
        <SectionContainer className="custom">
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toHaveClass("w-full");
      expect(section).toHaveClass("p-6");
      expect(section).toHaveClass("custom");
    });
  });

  describe("accessibility", () => {
    it("should render as a section element", () => {
      render(
        <SectionContainer>
          <div>Content</div>
        </SectionContainer>,
      );

      const section = document.querySelector("section");
      expect(section).toBeInTheDocument();
    });
  });
});
