"use client";

import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import {
  GitHubPixelIcon,
  LinkedInPixelIcon,
  TwitterPixelIcon,
  EmailPixelIcon,
} from "@/components/icons/PixelSocialIcons";
import { useState, useEffect } from "react";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";
import { PixelLoader } from "@/components/shared/PixelLoader";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [focusedField, setFocusedField] = useState<string>("");
  const [typingSound, setTypingSound] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [consoleMessages, setConsoleMessages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setSendingProgress(0);
    setConsoleMessages([]);

    // Simulate game-like loading with console messages
    const messages = [
      "Initializing connection...",
      "Encrypting message data...",
      "Establishing secure tunnel...",
      "Transmitting packet 1/3...",
      "Transmitting packet 2/3...",
      "Transmitting packet 3/3...",
      "Verifying integrity...",
      "Message delivered successfully!",
    ];

    for (let i = 0; i < messages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setConsoleMessages((prev) => [...prev, messages[i]]);
      setSendingProgress(((i + 1) / messages.length) * 100);
    }

    setStatus("sent");

    // Reset form after 5 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setStatus("idle");
      setConsoleMessages([]);
      setSendingProgress(0);
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    // Simulate typing sound effect
    setTypingSound(true);
    setTimeout(() => setTypingSound(false), 50);
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  // Add typing sound effect simulation
  useEffect(() => {
    if (typingSound) {
      // In a real implementation, you would play an actual sound file here
      // navigator.mediaDevices?.getUserMedia && new Audio('/sounds/type.wav').play().catch(() => {});
    }
  }, [typingSound]);

  return (
    <div className="min-h-screen bg-black">
      <ScrollAnimated animation="fade-in">
        <Header />
      </ScrollAnimated>

      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Breadcrumb */}
        <ScrollAnimated animation="slide-in-left">
          <div className="mb-8">
            <Breadcrumb />
          </div>
        </ScrollAnimated>

        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ ./contact.sh
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            CONTACT.EXE
          </h1>
          <p className="text-terminal-300 text-lg">
            Initialize communication protocol. Ready to receive your
            transmission.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div
            className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150"
            role="region"
            aria-labelledby="contact-form-heading"
          >
            <div
              id="contact-form-heading"
              className="font-pixel text-xs text-terminal-400 mb-6"
            >
              &gt; echo "message" &gt; /dev/contact
            </div>

            {status === "sending" ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <PixelLoader type="typewriter" text="TRANSMITTING DATA..." />
                </div>
                <div className="w-full bg-terminal-900 border border-terminal-500 h-4 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-200 ease-out"
                    style={{ width: `${sendingProgress}%` }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-pixel text-xs text-white">
                      {Math.round(sendingProgress)}%
                    </span>
                  </div>
                </div>
                <div className="font-mono text-xs text-terminal-300 h-32 overflow-hidden">
                  {consoleMessages.map((message, i) => (
                    <div key={i} className="opacity-100 animate-fade-in">
                      &gt; {message}
                    </div>
                  ))}
                </div>
              </div>
            ) : status === "sent" ? (
              <div className="space-y-4">
                <div className="font-pixel text-green-400 animate-pulse">
                  ✓ TRANSMISSION SUCCESSFUL
                </div>
                <div className="font-mono text-sm text-terminal-300">
                  <div>&gt; Connection established</div>
                  <div>&gt; HTTP/1.1 200 OK</div>
                  <div>&gt; Status: Message queued for processing</div>
                  <div>&gt; Response-Time: &lt; 24 hours</div>
                  <div>&gt; Session will reset in 5 seconds...</div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6"
                aria-labelledby="contact-form-heading"
              >
                <div>
                  <label
                    htmlFor="name"
                    className={`block font-pixel text-xs mb-2 transition-colors ${
                      focusedField === "name"
                        ? "text-green-400"
                        : "text-terminal-400"
                    }`}
                  >
                    {focusedField === "name" ? "> " : ""}NAME
                    {focusedField === "name" ? "_" : ":"}
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus("name")}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-describedby={
                      focusedField === "name" && typingSound
                        ? "name-status"
                        : undefined
                    }
                    className={`w-full p-3 bg-black text-white font-mono focus:outline-none transition-all duration-150 ${
                      focusedField === "name"
                        ? "border-2 border-green-400 shadow-md shadow-green-400/20"
                        : "border border-terminal-500 focus:border-white"
                    }`}
                    placeholder="Enter your name..."
                  />
                  {typingSound && focusedField === "name" && (
                    <div
                      id="name-status"
                      className="text-xs text-green-400 font-pixel mt-1"
                      aria-live="polite"
                    >
                      [KEYLOGGER ACTIVE]
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`block font-pixel text-xs mb-2 transition-colors ${
                      focusedField === "email"
                        ? "text-blue-400"
                        : "text-terminal-400"
                    }`}
                  >
                    {focusedField === "email" ? "> " : ""}EMAIL
                    {focusedField === "email" ? "_" : ":"}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-describedby={
                      focusedField === "email" && typingSound
                        ? "email-status"
                        : undefined
                    }
                    className={`w-full p-3 bg-black text-white font-mono focus:outline-none transition-all duration-150 ${
                      focusedField === "email"
                        ? "border-2 border-blue-400 shadow-md shadow-blue-400/20"
                        : "border border-terminal-500 focus:border-white"
                    }`}
                    placeholder="your.email@domain.com"
                  />
                  {typingSound && focusedField === "email" && (
                    <div
                      id="email-status"
                      className="text-xs text-blue-400 font-pixel mt-1"
                      aria-live="polite"
                    >
                      [EMAIL VALIDATOR RUNNING]
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className={`block font-pixel text-xs mb-2 transition-colors ${
                      focusedField === "subject"
                        ? "text-purple-400"
                        : "text-terminal-400"
                    }`}
                  >
                    {focusedField === "subject" ? "> " : ""}SUBJECT
                    {focusedField === "subject" ? "_" : ":"}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onFocus={() => handleFocus("subject")}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-describedby={
                      focusedField === "subject" ? "subject-status" : undefined
                    }
                    className={`w-full p-3 bg-black text-white font-mono focus:outline-none transition-all duration-150 ${
                      focusedField === "subject"
                        ? "border-2 border-purple-400 shadow-md shadow-purple-400/20"
                        : "border border-terminal-500 focus:border-white"
                    }`}
                  >
                    <option value="">Select category...</option>
                    <option value="collaboration">🤝 Collaboration</option>
                    <option value="job_opportunity">💼 Job Opportunity</option>
                    <option value="project_inquiry">🚀 Project Inquiry</option>
                    <option value="consulting">💡 Consulting</option>
                    <option value="other">📋 Other</option>
                  </select>
                  {focusedField === "subject" && (
                    <div
                      id="subject-status"
                      className="text-xs text-purple-400 font-pixel mt-1"
                      aria-live="polite"
                    >
                      [CATEGORY SELECTOR ACTIVE]
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className={`block font-pixel text-xs mb-2 transition-colors ${
                      focusedField === "message"
                        ? "text-orange-400"
                        : "text-terminal-400"
                    }`}
                  >
                    {focusedField === "message" ? "> " : ""}MESSAGE
                    {focusedField === "message" ? "_" : ":"}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus("message")}
                    onBlur={handleBlur}
                    required
                    aria-required="true"
                    aria-describedby={
                      focusedField === "message" && typingSound
                        ? "message-status"
                        : undefined
                    }
                    rows={6}
                    className={`w-full p-3 bg-black text-white font-mono focus:outline-none resize-none transition-all duration-150 ${
                      focusedField === "message"
                        ? "border-2 border-orange-400 shadow-md shadow-orange-400/20"
                        : "border border-terminal-500 focus:border-white"
                    }`}
                    placeholder="Type your message here..."
                  />
                  {typingSound && focusedField === "message" && (
                    <div
                      id="message-status"
                      className="text-xs text-orange-400 font-pixel mt-1"
                      aria-live="polite"
                    >
                      [MESSAGE BUFFER: {formData.message.length}/1000 chars]
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className={`
                    w-full p-4 border-2 font-pixel text-sm transition-all duration-150 relative overflow-hidden
                    ${
                      status !== "idle"
                        ? "border-terminal-500 text-terminal-500 cursor-not-allowed"
                        : "border-white bg-white text-black hover:bg-transparent hover:text-white hover:shadow-lg hover:shadow-white/20 hover:border-green-400 active:scale-95"
                    }
                  `}
                >
                  <div className="relative z-10">🚀 SEND MESSAGE</div>
                  {status === "idle" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000"></div>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div
              className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150"
              role="region"
              aria-labelledby="direct-contact-heading"
            >
              <div
                id="direct-contact-heading"
                className="font-pixel text-xs text-terminal-400 mb-4"
              >
                &gt; cat contact_info.txt
              </div>
              <div className="space-y-4">
                <div>
                  <div className="font-pixel text-xs text-terminal-500 mb-1">
                    EMAIL:
                  </div>
                  <div className="font-mono text-white">
                    <a
                      href="mailto:hello@caspian.dev"
                      className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded"
                      aria-label="Send email to hello@caspian.dev"
                    >
                      hello@caspian.dev
                    </a>
                  </div>
                </div>
                <div>
                  <div className="font-pixel text-xs text-terminal-500 mb-1">
                    RESPONSE_TIME:
                  </div>
                  <div className="font-mono text-terminal-300">
                    &lt; 24 hours
                  </div>
                </div>
                <div>
                  <div className="font-pixel text-xs text-terminal-500 mb-1">
                    AVAILABILITY:
                  </div>
                  <div className="font-mono text-terminal-300">
                    Mon-Fri, 9AM-6PM UTC
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150"
              role="region"
              aria-labelledby="social-links-heading"
            >
              <div
                id="social-links-heading"
                className="font-pixel text-xs text-terminal-400 mb-4"
              >
                &gt; ls -la social/
              </div>
              <div className="space-y-3">
                <a
                  href="https://github.com/caspianalmerud"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Caspian's GitHub profile (opens in new tab)"
                  className="flex items-center gap-3 font-mono text-terminal-300 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-black rounded p-1 -m-1"
                >
                  <GitHubPixelIcon
                    className="text-terminal-400 group-hover:text-white transition-colors"
                    size={16}
                    aria-hidden="true"
                  />
                  → github.com/caspianalmerud
                </a>
                <a
                  href="https://linkedin.com/in/caspian-almerud"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with Caspian on LinkedIn (opens in new tab)"
                  className="flex items-center gap-3 font-mono text-terminal-300 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded p-1 -m-1"
                >
                  <LinkedInPixelIcon
                    className="text-terminal-400 group-hover:text-blue-400 transition-colors"
                    size={16}
                    aria-hidden="true"
                  />
                  → linkedin.com/in/caspian-almerud
                </a>
                <a
                  href="https://twitter.com/caspianalmerud"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Caspian on Twitter (opens in new tab)"
                  className="flex items-center gap-3 font-mono text-terminal-300 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded p-1 -m-1"
                >
                  <TwitterPixelIcon
                    className="text-terminal-400 group-hover:text-blue-400 transition-colors"
                    size={16}
                    aria-hidden="true"
                  />
                  → twitter.com/caspianalmerud
                </a>
                <div className="flex items-center gap-3 font-mono text-terminal-300">
                  <EmailPixelIcon
                    className="text-terminal-400"
                    size={16}
                    aria-hidden="true"
                  />
                  <span aria-label="Email address">→ hello@caspian.dev</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div
              className="border border-terminal-400 p-6"
              role="region"
              aria-labelledby="location-heading"
            >
              <div
                id="location-heading"
                className="font-pixel text-xs text-terminal-400 mb-4"
              >
                &gt; curl -s ipinfo.io
              </div>
              <div className="space-y-2">
                <div className="font-mono text-sm">
                  <span className="text-terminal-500">"timezone":</span>
                  <span className="text-terminal-300 ml-2">"UTC+0"</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-terminal-500">"region":</span>
                  <span className="text-terminal-300 ml-2">
                    "Remote Global"
                  </span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-terminal-500">"status":</span>
                  <span className="text-green-400 ml-2">"online"</span>
                </div>
              </div>
            </div>

            {/* PGP Key */}
            <div
              className="border border-terminal-400 p-6"
              role="region"
              aria-labelledby="pgp-key-heading"
            >
              <div
                id="pgp-key-heading"
                className="font-pixel text-xs text-terminal-400 mb-4"
              >
                &gt; gpg --list-keys
              </div>
              <div className="font-mono text-xs text-terminal-300 space-y-1">
                <div>pub 4096R/ABCD1234 2024-01-01</div>
                <div>uid Caspian &lt;hello@caspian.dev&gt;</div>
                <div className="text-terminal-500 mt-2">
                  For secure communications
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-terminal-400">
          <div className="font-pixel text-xs text-terminal-500 text-center">
            Connection established. Awaiting your input...
          </div>
        </div>
      </main>
    </div>
  );
}
