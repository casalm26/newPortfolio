"use client";

import Header from "@/components/shared/Header";
import Breadcrumb from "@/components/shared/Breadcrumb";
import {
  GitHubPixelIcon,
  LinkedInPixelIcon,
  XPixelIcon,
  EmailPixelIcon,
} from "@/components/icons/PixelSocialIcons";
import { PageTransition } from "@/components/shared/PageTransition";
import { ScrollAnimated } from "@/components/shared/ScrollAnimated";

export default function ContactForm() {
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
          {/* Mailto CTA */}
          <div className="border border-terminal-400 p-6 hover:border-white hover:shadow-lg hover:shadow-white/5 transition-all duration-150 flex flex-col justify-center">
            <div className="font-pixel text-xs text-terminal-400 mb-6">
              &gt; echo "message" &gt; /dev/contact
            </div>
            <div className="space-y-6">
              <p className="text-terminal-300 text-sm leading-relaxed">
                Ready to collaborate? Send me a message and I'll get back to you
                within 24 hours.
              </p>
              <a
                href="mailto:caspian@houseofcaspian.com"
                className="inline-block w-full p-4 border-2 border-white bg-white text-black font-pixel text-sm text-center transition-all duration-150 hover:bg-transparent hover:text-white hover:shadow-lg hover:shadow-white/20 hover:border-green-400 active:scale-95"
              >
                SEND EMAIL →
              </a>
              <div className="font-mono text-xs text-terminal-500 text-center">
                caspian@houseofcaspian.com
              </div>
            </div>
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
                      href="mailto:caspian@houseofcaspian.com"
                      className="hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded"
                      aria-label="Send email to caspian@houseofcaspian.com"
                    >
                      caspian@houseofcaspian.com
                    </a>
                  </div>
                </div>
                <div>
                  <div className="font-pixel text-xs text-terminal-500 mb-1">
                    LOCATION:
                  </div>
                  <div className="font-mono text-terminal-300">
                    Stockholm, Sweden
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
                  href="https://github.com/casalm26"
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
                  → github.com/casalm26
                </a>
                <a
                  href="https://linkedin.com/in/caspianalmerud"
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
                  → linkedin.com/in/caspianalmerud
                </a>
                <a
                  href="https://x.com/almerudcaspian"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Caspian on X (opens in new tab)"
                  className="flex items-center gap-3 font-mono text-terminal-300 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black rounded p-1 -m-1"
                >
                  <XPixelIcon
                    className="text-terminal-400 group-hover:text-blue-400 transition-colors"
                    size={16}
                    aria-hidden="true"
                  />
                  → x.com/almerudcaspian
                </a>
                <div className="flex items-center gap-3 font-mono text-terminal-300">
                  <EmailPixelIcon
                    className="text-terminal-400"
                    size={16}
                    aria-hidden="true"
                  />
                  <span aria-label="Email address">
                    → caspian@houseofcaspian.com
                  </span>
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
