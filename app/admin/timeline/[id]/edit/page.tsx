"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { TimelineEntryForm } from "@/components/admin/forms/TimelineEntryForm";
import { useAuth } from "@/components/admin/AuthContext";
import { cmsApiFetch } from "@/lib/admin/api";

export default function EditTimelinePage() {
  const { id } = useParams<{ id: string }>();
  const { apiKey } = useAuth();
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiKey || !id) return;
    cmsApiFetch(`/timeline/${id}`, apiKey)
      .then((data) => {
        const entry = data as Record<string, unknown>;
        // Format dates for date inputs
        if (entry.startDate && typeof entry.startDate === "string") {
          entry.startDate = (entry.startDate as string).slice(0, 10);
        }
        if (entry.endDate && typeof entry.endDate === "string") {
          entry.endDate = (entry.endDate as string).slice(0, 10);
        }
        setInitial(entry);
      })
      .catch(() => setError("Failed to load timeline entry"));
  }, [apiKey, id]);

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="font-pixel text-sm text-white">
          admin@cms:~/timeline$ vim {id}
        </h1>
        <p className="mt-1 font-pixel text-xs text-terminal-500">
          Edit timeline entry
        </p>
      </div>
      {error ? (
        <p className="font-pixel text-xs text-red-400">{error}</p>
      ) : !initial ? (
        <p className="font-pixel text-xs text-terminal-400 animate-pulse">
          Loading...
        </p>
      ) : (
        <TimelineEntryForm
          initial={
            initial as unknown as {
              entryId: string;
              type: string;
              title: string;
              company: string;
              institution: string;
              category: string;
              location: string;
              startDate: string;
              endDate: string;
              current: boolean;
              description: string;
              responsibilities: string[];
              details: string[];
              achievements: string[];
              skills: string[];
              level: string;
              yearsOfExperience: number | null;
              impact: string;
              issuer: string;
              credentialId: string;
              links: Record<string, string>;
              order: number;
            }
          }
          entryId={id}
        />
      )}
    </AdminShell>
  );
}
