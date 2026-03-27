"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/admin/AuthContext";

export default function LoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setApiKey } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/cms/posts?limit=1", {
        headers: { "x-api-key": key },
      });

      if (res.ok) {
        setApiKey(key);
        router.push("/admin");
      } else {
        setError("ACCESS DENIED: Invalid API key");
      }
    } catch {
      setError("CONNECTION ERROR: Could not reach server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md border border-terminal-400 p-8">
        <div className="mb-6">
          <h1 className="font-pixel text-sm text-white">ADMIN CMS</h1>
          <p className="mt-1 font-pixel text-xs text-terminal-500">
            caspianalmerud.se content management
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="mb-2 block font-pixel text-xs text-terminal-400">
            admin@cms:~$ authenticate
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter API key..."
            className="w-full bg-black px-4 py-3 font-pixel text-sm text-white border border-terminal-400 focus:border-white focus:outline-none placeholder-terminal-600 transition-colors"
            autoFocus
          />

          {error && (
            <p className="mt-3 font-pixel text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !key}
            className="mt-4 w-full border border-terminal-400 bg-black px-4 py-3 font-pixel text-xs text-white transition-colors hover:border-white hover:bg-white hover:text-black disabled:opacity-40 disabled:hover:border-terminal-400 disabled:hover:bg-black disabled:hover:text-white"
          >
            {loading ? "Authenticating..." : "[LOGIN]"}
          </button>
        </form>
      </div>
    </div>
  );
}
