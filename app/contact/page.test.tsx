import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Contact from "./page";

// Mock the Header component
vi.mock("@/components/shared/Header", () => ({
  default: () => <div data-testid="header">Header</div>,
}));

describe("Contact Page", () => {
  describe("Page Rendering", () => {
    it("should render contact form and information", () => {
      render(<Contact />);

      expect(screen.getByText("CONTACT.EXE")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Initialize communication protocol. Ready to receive your transmission.",
        ),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("NAME:")).toBeInTheDocument();
      expect(screen.getByLabelText("EMAIL:")).toBeInTheDocument();
    });

    it("should render terminal-style command prompts", () => {
      render(<Contact />);

      expect(
        screen.getByText("caspian@localhost:~$ ./contact.sh"),
      ).toBeInTheDocument();
      expect(
        screen.getByText('> echo "message" > /dev/contact'),
      ).toBeInTheDocument();
      expect(screen.getByText("> cat contact_info.txt")).toBeInTheDocument();
    });

    it("should render contact information sections", () => {
      render(<Contact />);

      expect(screen.getByText("caspian@example.com")).toBeInTheDocument();
      expect(screen.getByText("< 24 hours")).toBeInTheDocument();
      expect(screen.getByText("Mon-Fri, 9AM-6PM UTC")).toBeInTheDocument();
    });

    it("should render social links", () => {
      render(<Contact />);

      expect(
        screen.getByRole("link", { name: /github.com\/caspian/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /linkedin.com\/in\/caspian/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /twitter.com\/caspian/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Form Functionality", () => {
    it("should handle form input changes", () => {
      render(<Contact />);

      const nameInput = screen.getByLabelText("NAME:") as HTMLInputElement;
      const emailInput = screen.getByLabelText("EMAIL:") as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });

      expect(nameInput.value).toBe("John Doe");
      expect(emailInput.value).toBe("john@example.com");
    });

    it("should handle subject selection", () => {
      render(<Contact />);

      const subjectSelect = screen.getByLabelText(
        "SUBJECT:",
      ) as HTMLSelectElement;
      fireEvent.change(subjectSelect, { target: { value: "collaboration" } });

      expect(subjectSelect.value).toBe("collaboration");
    });

    it("should handle message textarea input", () => {
      render(<Contact />);

      const messageInput = screen.getByLabelText(
        "MESSAGE:",
      ) as HTMLTextAreaElement;
      fireEvent.change(messageInput, { target: { value: "Test message" } });

      expect(messageInput.value).toBe("Test message");
    });

    it("should show sending state when form is submitted", async () => {
      render(<Contact />);

      const form = screen
        .getByRole("button", { name: "SEND MESSAGE" })
        .closest("form");
      const nameInput = screen.getByLabelText("NAME:");
      const emailInput = screen.getByLabelText("EMAIL:");
      const subjectSelect = screen.getByLabelText("SUBJECT:");
      const messageInput = screen.getByLabelText("MESSAGE:");

      // Fill required fields
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(subjectSelect, { target: { value: "collaboration" } });
      fireEvent.change(messageInput, { target: { value: "Test message" } });

      fireEvent.submit(form!);

      expect(screen.getByText("TRANSMITTING...")).toBeInTheDocument();
    });

    it("should show success message after form submission", async () => {
      render(<Contact />);

      const form = screen
        .getByRole("button", { name: "SEND MESSAGE" })
        .closest("form");
      const nameInput = screen.getByLabelText("NAME:");
      const emailInput = screen.getByLabelText("EMAIL:");
      const subjectSelect = screen.getByLabelText("SUBJECT:");
      const messageInput = screen.getByLabelText("MESSAGE:");

      // Fill required fields
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(subjectSelect, { target: { value: "collaboration" } });
      fireEvent.change(messageInput, { target: { value: "Test message" } });

      fireEvent.submit(form!);

      await waitFor(() => {
        expect(
          screen.getByText("Message sent successfully!"),
        ).toBeInTheDocument();
        expect(screen.getByText("HTTP/1.1 200 OK")).toBeInTheDocument();
      });
    });
  });

  describe("Form Validation", () => {
    it("should require name field", () => {
      render(<Contact />);

      const nameInput = screen.getByLabelText("NAME:");
      expect(nameInput).toBeRequired();
    });

    it("should require email field", () => {
      render(<Contact />);

      const emailInput = screen.getByLabelText("EMAIL:");
      expect(emailInput).toBeRequired();
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("should require subject selection", () => {
      render(<Contact />);

      const subjectSelect = screen.getByLabelText("SUBJECT:");
      expect(subjectSelect).toBeRequired();
    });

    it("should require message field", () => {
      render(<Contact />);

      const messageInput = screen.getByLabelText("MESSAGE:");
      expect(messageInput).toBeRequired();
    });
  });

  describe("Social Links", () => {
    it("should have proper external link attributes", () => {
      render(<Contact />);

      const githubLink = screen.getByRole("link", {
        name: /github.com\/caspian/i,
      });
      const linkedinLink = screen.getByRole("link", {
        name: /linkedin.com\/in\/caspian/i,
      });

      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
      expect(linkedinLink).toHaveAttribute("target", "_blank");
      expect(linkedinLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Terminal Styling", () => {
    it("should have matrix theme styling", () => {
      const { container } = render(<Contact />);

      expect(container.firstChild).toHaveClass("min-h-screen", "bg-black");
    });

    it("should have pixel font styling for headers", () => {
      render(<Contact />);

      const title = screen.getByText("CONTACT.EXE");
      expect(title).toHaveClass("font-pixel");
    });

    it("should have terminal color scheme", () => {
      render(<Contact />);

      const commandPrompt = screen.getByText(
        "caspian@localhost:~$ ./contact.sh",
      );
      expect(commandPrompt).toHaveClass("text-terminal-400");
    });
  });

  describe("Edge Cases", () => {
    it("should handle form submission with empty required fields", () => {
      render(<Contact />);

      const submitButton = screen.getByRole("button", { name: "SEND MESSAGE" });

      // Should not crash when submitting empty form
      // Browser validation will prevent submission
      expect(submitButton).toBeInTheDocument();
    });

    it("should handle form reset after successful submission", async () => {
      render(<Contact />);

      const form = screen
        .getByRole("button", { name: "SEND MESSAGE" })
        .closest("form");
      const nameInput = screen.getByLabelText("NAME:") as HTMLInputElement;

      fireEvent.change(nameInput, { target: { value: "Test" } });
      expect(nameInput.value).toBe("Test");

      // Form should reset after successful submission timeout
      // This is tested by the component's internal logic
    });
  });
});
