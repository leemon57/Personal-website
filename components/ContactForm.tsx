"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { profile } from "@/lib/profile";

const initialFields = {
  name: "",
  email: "",
  company: "",
  role: "",
  message: "",
  website: "",
};

type ContactFields = typeof initialFields;
type SubmitState = "idle" | "submitting" | "success" | "error";

function readErrorMessage(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }

  return "Message could not be sent right now.";
}

export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(initialFields);
  const [state, setState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  function updateField(field: keyof ContactFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state === "submitting") {
      return;
    }

    setState("submitting");
    setFeedback("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fields),
        signal: controller.signal,
      });
      const payload: unknown = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(readErrorMessage(payload));
      }

      setFields(initialFields);
      setState("success");
      setFeedback("Thanks. I received your info and will message back by email.");
    } catch (error) {
      const message =
        error instanceof Error && error.name === "AbortError"
          ? "Message timed out. Email me directly if this keeps happening."
          : error instanceof Error
            ? error.message
            : "Message could not be sent right now.";
      setState("error");
      setFeedback(message);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={(event) => {
        void submit(event);
      }}
    >
      <div className="contact-form-grid">
        <label>
          <span>Name</span>
          <input
            autoComplete="name"
            disabled={state === "submitting"}
            minLength={2}
            name="name"
            onChange={(event) => updateField("name", event.target.value)}
            required
            type="text"
            value={fields.name}
          />
        </label>

        <label>
          <span>Email</span>
          <input
            autoComplete="email"
            disabled={state === "submitting"}
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            required
            type="email"
            value={fields.email}
          />
        </label>

        <label>
          <span>Company</span>
          <input
            autoComplete="organization"
            disabled={state === "submitting"}
            name="company"
            onChange={(event) => updateField("company", event.target.value)}
            type="text"
            value={fields.company}
          />
        </label>

        <label>
          <span>Role / team</span>
          <input
            autoComplete="organization-title"
            disabled={state === "submitting"}
            name="role"
            onChange={(event) => updateField("role", event.target.value)}
            placeholder="Recruiting, engineering, data..."
            type="text"
            value={fields.role}
          />
        </label>
      </div>

      <label>
        <span>Message</span>
        <textarea
          disabled={state === "submitting"}
          maxLength={3000}
          minLength={20}
          name="message"
          onChange={(event) => updateField("message", event.target.value)}
          required
          rows={7}
          value={fields.message}
        />
      </label>

      <label className="contact-honeypot" tabIndex={-1}>
        <span>Website</span>
        <input
          autoComplete="off"
          name="website"
          onChange={(event) => updateField("website", event.target.value)}
          tabIndex={-1}
          type="text"
          value={fields.website}
        />
      </label>

      <div className="contact-actions">
        <button disabled={state === "submitting"} type="submit">
          {state === "submitting" ? "Sending" : "Leave info"}
        </button>
        <a href={`mailto:${profile.email}`}>Email directly</a>
      </div>

      {feedback ? (
        <p className={`contact-feedback ${state}`} role="status">
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
