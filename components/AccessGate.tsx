"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * AccessGate
 *
 * "Leave a message to unlock" form. On submit it posts to /api/access/request,
 * which emails the owner the message and (unless an allowlist blocks it) sets the
 * access cookie immediately — no magic-link round-trip. On success it navigates
 * to `next` (the now-unlocked page or the resume). Used on the locked /courses
 * view and the /unlock page.
 */
type Status = "idle" | "sending" | "sent" | "error";

export function AccessGate({ next = "/courses" }: { next?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") {
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/access/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, next, website }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
        granted?: boolean;
      };
      if (!response.ok) {
        throw new Error(data.error ?? "Could not send your message right now.");
      }
      if (data.granted) {
        trackEvent("access_unlocked", { next });
        // Cookie is set; go to the now-unlocked destination.
        window.location.assign(next);
        return;
      }
      trackEvent("access_requested", { next });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <p className="access-sent" role="status">
        Thanks — your message came through. I&apos;ll follow up by email.
      </p>
    );
  }

  return (
    <form className="access-form" onSubmit={(event) => void submit(event)}>
      <div className="access-row">
        <label className="sr-only" htmlFor="access-name">
          Your name (optional)
        </label>
        <input
          autoComplete="name"
          id="access-name"
          onChange={(event) => setName(event.target.value)}
          placeholder="Name (optional)"
          type="text"
          value={name}
        />
        <label className="sr-only" htmlFor="access-email">
          Your email
        </label>
        <input
          autoComplete="email"
          id="access-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@company.com"
          required
          type="email"
          value={email}
        />
      </div>
      <label className="sr-only" htmlFor="access-message">
        Your message
      </label>
      <textarea
        id="access-message"
        onChange={(event) => setMessage(event.target.value)}
        placeholder="A quick note — who you are and what you're looking for."
        required
        rows={3}
        value={message}
      />
      <input
        aria-hidden="true"
        autoComplete="off"
        className="access-hp"
        name="website"
        onChange={(event) => setWebsite(event.target.value)}
        tabIndex={-1}
        type="text"
        value={website}
      />
      <div className="access-actions">
        <button disabled={status === "sending"} type="submit">
          {status === "sending" ? "Unlocking…" : "Leave message & unlock"}
        </button>
        <p className="access-note">
          This is here to protect my privacy — leave a message and it unlocks
          right away.
        </p>
      </div>
      {error ? (
        <p className="access-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
