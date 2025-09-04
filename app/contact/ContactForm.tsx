'use client';

import Header from '@/components/shared/Header';
import Breadcrumb from '@/components/shared/Breadcrumb';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('sent');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus('idle');
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb />
        </div>

        {/* Terminal Header */}
        <div className="mb-12">
          <div className="font-pixel text-sm text-terminal-400 mb-2">
            caspian@localhost:~$ ./contact.sh
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel font-bold text-white mb-4">
            CONTACT.EXE
          </h1>
          <p className="text-terminal-300 text-lg">
            Initialize communication protocol. Ready to receive your transmission.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="border border-terminal-400 p-6">
            <div className="font-pixel text-xs text-terminal-400 mb-6">
              &gt; echo "message" &gt; /dev/contact
            </div>
            
            {status === 'sent' ? (
              <div className="space-y-4">
                <div className="font-pixel text-green-400">
                  Message sent successfully!
                </div>
                <div className="font-mono text-sm text-terminal-300">
                  <div>HTTP/1.1 200 OK</div>
                  <div>Status: Message queued for processing</div>
                  <div>Response-Time: &lt; 24 hours</div>
                  <div>Connection: Will be established shortly</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-pixel text-xs text-terminal-400 mb-2">
                    NAME:
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-black border border-terminal-500 text-white font-mono focus:border-white focus:outline-none"
                    placeholder="Enter your name..."
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-pixel text-xs text-terminal-400 mb-2">
                    EMAIL:
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-black border border-terminal-500 text-white font-mono focus:border-white focus:outline-none"
                    placeholder="your.email@domain.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block font-pixel text-xs text-terminal-400 mb-2">
                    SUBJECT:
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full p-3 bg-black border border-terminal-500 text-white font-mono focus:border-white focus:outline-none"
                  >
                    <option value="">Select category...</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="job_opportunity">Job Opportunity</option>
                    <option value="project_inquiry">Project Inquiry</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block font-pixel text-xs text-terminal-400 mb-2">
                    MESSAGE:
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full p-3 bg-black border border-terminal-500 text-white font-mono focus:border-white focus:outline-none resize-none"
                    placeholder="Type your message here..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={`
                    w-full p-3 border font-pixel text-xs transition-colors
                    ${status === 'sending' 
                      ? 'border-terminal-500 text-terminal-500 cursor-not-allowed'
                      : 'border-white bg-white text-black hover:bg-transparent hover:text-white'
                    }
                  `}
                >
                  {status === 'sending' ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Direct Contact */}
            <div className="border border-terminal-400 p-6">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; cat contact_info.txt
              </div>
              <div className="space-y-4">
                <div>
                  <div className="font-pixel text-xs text-terminal-500 mb-1">EMAIL:</div>
                  <div className="font-mono text-white">hello@caspian.dev</div>
                </div>
                <div>
                  <div className="font-pixel text-xs text-terminal-500 mb-1">RESPONSE_TIME:</div>
                  <div className="font-mono text-terminal-300">&lt; 24 hours</div>
                </div>
                <div>
                  <div className="font-pixel text-xs text-terminal-500 mb-1">AVAILABILITY:</div>
                  <div className="font-mono text-terminal-300">Mon-Fri, 9AM-6PM UTC</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="border border-terminal-400 p-6">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; ls -la social/
              </div>
              <div className="space-y-3">
                <a 
                  href="https://github.com/caspianalmerud" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block font-mono text-terminal-300 hover:text-white transition-colors"
                >
                  → github.com/caspianalmerud
                </a>
                <a 
                  href="https://linkedin.com/in/caspian-almerud" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block font-mono text-terminal-300 hover:text-white transition-colors"
                >
                  → linkedin.com/in/caspian-almerud
                </a>
                <a 
                  href="https://twitter.com/caspianalmerud" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block font-mono text-terminal-300 hover:text-white transition-colors"
                >
                  → twitter.com/caspianalmerud
                </a>
              </div>
            </div>

            {/* Location */}
            <div className="border border-terminal-400 p-6">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; curl -s ipinfo.io
              </div>
              <div className="space-y-2">
                <div className="font-mono text-sm">
                  <span className="text-terminal-500">"timezone":</span>
                  <span className="text-terminal-300 ml-2">"UTC+0"</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-terminal-500">"region":</span>
                  <span className="text-terminal-300 ml-2">"Remote Global"</span>
                </div>
                <div className="font-mono text-sm">
                  <span className="text-terminal-500">"status":</span>
                  <span className="text-green-400 ml-2">"online"</span>
                </div>
              </div>
            </div>

            {/* PGP Key */}
            <div className="border border-terminal-400 p-6">
              <div className="font-pixel text-xs text-terminal-400 mb-4">
                &gt; gpg --list-keys
              </div>
              <div className="font-mono text-xs text-terminal-300 space-y-1">
                <div>pub   4096R/ABCD1234 2024-01-01</div>
                <div>uid   Caspian &lt;hello@caspian.dev&gt;</div>
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