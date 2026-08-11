"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import { profile } from "@/lib/profile";
import { contactFormContent } from "@/lib/site";

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
type FieldErrors = Partial<Record<keyof ContactFields, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const minMessageLength = 20;

/** Mirrors the server-side rules so the user sees errors before submitting. */
function validateField(field: keyof ContactFields, raw: string): string | undefined {
  const value = raw.trim();
  if (field === "name") {
    if (value.length === 0) return "Please enter your name.";
    if (value.length < 2) return "Name must be at least 2 characters.";
  }
  if (field === "email") {
    if (value.length === 0) return "Please enter your email.";
    if (!emailPattern.test(value) || value.length > 254) {
      return "Enter a valid email address.";
    }
  }
  if (field === "message") {
    if (value.length === 0) return "Please enter a message.";
    if (value.length < minMessageLength) {
      return `Message must be at least ${minMessageLength} characters (${value.length}/${minMessageLength}).`;
    }
  }
  return undefined;
}

function readErrorMessage(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }

  return contactFormContent.defaultError;
}

export function ContactForm() {
  const [fields, setFields] = useState<ContactFields>(initialFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function updateField(field: keyof ContactFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    // Live-clear an existing error as the user corrects it.
    setErrors((current) =>
      current[field] ? { ...current, [field]: validateField(field, value) } : current,
    );
  }

  function handleBlur(field: keyof ContactFields) {
    setErrors((current) => ({ ...current, [field]: validateField(field, fields[field]) }));
  }

  function focusFirstInvalid(nextErrors: FieldErrors) {
    if (nextErrors.name) {
      nameRef.current?.focus();
    } else if (nextErrors.email) {
      emailRef.current?.focus();
    } else if (nextErrors.message) {
      messageRef.current?.focus();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state === "submitting") {
      return;
    }

    const nextErrors: FieldErrors = {
      name: validateField("name", fields.name),
      email: validateField("email", fields.email),
      message: validateField("message", fields.message),
    };
    if (nextErrors.name || nextErrors.email || nextErrors.message) {
      setErrors(nextErrors);
      setState("error");
      setFeedback("Please fix the highlighted fields and try again.");
      focusFirstInvalid(nextErrors);
      return;
    }

    setErrors({});
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
      setFeedback(contactFormContent.successMessage);
    } catch (error) {
      const message =
        error instanceof Error && error.name === "AbortError"
          ? contactFormContent.timeoutMessage
          : error instanceof Error
            ? error.message
            : contactFormContent.defaultError;
      setState("error");
      setFeedback(message);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  const disabled = state === "submitting";

  return (
    <form
      className="contact-form"
      noValidate
      onSubmit={(event) => {
        void submit(event);
      }}
    >
      <div className="contact-form-grid">
        <label>
          <span>
            Name
            <span aria-hidden="true" className="req">
              *
            </span>
          </span>
          <input
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-invalid={errors.name ? true : undefined}
            aria-required="true"
            autoComplete="name"
            disabled={disabled}
            name="name"
            onBlur={() => handleBlur("name")}
            onChange={(event) => updateField("name", event.target.value)}
            ref={nameRef}
            type="text"
            value={fields.name}
          />
          {errors.name ? (
            <span className="field-error" id="name-error" role="alert">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label>
          <span>
            Email
            <span aria-hidden="true" className="req">
              *
            </span>
          </span>
          <input
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={errors.email ? true : undefined}
            aria-required="true"
            autoComplete="email"
            disabled={disabled}
            inputMode="email"
            name="email"
            onBlur={() => handleBlur("email")}
            onChange={(event) => updateField("email", event.target.value)}
            ref={emailRef}
            type="email"
            value={fields.email}
          />
          {errors.email ? (
            <span className="field-error" id="email-error" role="alert">
              {errors.email}
            </span>
          ) : null}
        </label>

        <label>
          <span>Company</span>
          <input
            autoComplete="organization"
            disabled={disabled}
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
            disabled={disabled}
            name="role"
            onChange={(event) => updateField("role", event.target.value)}
            placeholder={contactFormContent.rolePlaceholder}
            type="text"
            value={fields.role}
          />
        </label>
      </div>

      <label>
        <span>
          Message
          <span aria-hidden="true" className="req">
            *
          </span>
        </span>
        <textarea
          aria-describedby={errors.message ? "message-help message-error" : "message-help"}
          aria-invalid={errors.message ? true : undefined}
          aria-required="true"
          disabled={disabled}
          maxLength={3000}
          name="message"
          onBlur={() => handleBlur("message")}
          onChange={(event) => updateField("message", event.target.value)}
          ref={messageRef}
          rows={7}
          value={fields.message}
        />
        <span className="field-help" id="message-help">
          A sentence or two about the role or project — at least {minMessageLength}{" "}
          characters.
        </span>
        {errors.message ? (
          <span className="field-error" id="message-error" role="alert">
            {errors.message}
          </span>
        ) : null}
      </label>

      <label aria-hidden="true" className="contact-honeypot" tabIndex={-1}>
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
        <button disabled={disabled} type="submit">
          {disabled
            ? contactFormContent.submittingLabel
            : contactFormContent.submitLabel}
        </button>
        <a href={`mailto:${profile.email}`}>{contactFormContent.directEmailLabel}</a>
      </div>

      {feedback ? (
        <p
          className={`contact-feedback ${state}`}
          role={state === "error" ? "alert" : "status"}
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
