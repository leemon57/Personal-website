import type { Metadata } from "next";
import { AccessGate } from "@/components/AccessGate";
import { profile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Unlock",
  robots: { index: false, follow: false },
};

interface UnlockPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

function safeNext(raw: string | undefined): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/courses";
}

export default async function UnlockPage({ searchParams }: UnlockPageProps) {
  const { next, error } = await searchParams;

  return (
    <div className="layout">
      <div className="unlock-card">
        <p className="caps">Recruiter access</p>
        <h1 className="section-title">Unlock the full portfolio</h1>
        <p className="muted">
          {profile.name}&apos;s full transcript (courses + grades) and resume are
          shared with recruiters. Leave a quick message to unlock them.
        </p>
        {error ? (
          <p className="access-error" role="alert">
            That link was invalid or expired — request a new one below.
          </p>
        ) : null}
        <AccessGate next={safeNext(next)} />
      </div>
    </div>
  );
}
