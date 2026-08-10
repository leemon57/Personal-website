"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { AgentAnswerBody, AgentAnswerSources } from "@/components/AgentAnswer";
import {
  type AgentMessage,
  useAssistant,
} from "@/components/AssistantProvider";
import { trackEvent } from "@/lib/analytics";
import {
  answerPortfolioQuestion,
  type AgentAnswer,
  type AgentProject,
  type SourceLink,
} from "@/lib/portfolio-agent";
import { assistantContent } from "@/lib/site";

/** Tracks the in-progress typewriter reveal for the newest assistant reply. */
type TypingState = { id: number; len: number } | null;

interface PortfolioAgentProps {
  projects: AgentProject[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readSourceLinks(value: unknown): SourceLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      !isRecord(item) ||
      typeof item.label !== "string" ||
      typeof item.href !== "string"
    ) {
      return [];
    }

    return [
      {
        id: typeof item.id === "string" ? item.id : `${item.label}:${item.href}`,
        label: item.label,
        href: item.href,
      },
    ];
  });
}

function readAgentAnswer(value: unknown): AgentAnswer | undefined {
  if (!isRecord(value) || typeof value.content !== "string") {
    return undefined;
  }

  return {
    content: value.content,
    sources: readSourceLinks(value.sources),
  };
}

const followUpPool = [
  "Are you open to Winter 2027 co-op?",
  "What's your tech stack?",
  "Which project shows full-stack work?",
  "How can I reach you?",
];

/** Up to 3 contextual next questions based on the latest answer + what's asked. */
function computeFollowUps(messages: AgentMessage[]): string[] {
  const lastAssistant = [...messages].reverse().find(
    (message) => message.role === "assistant",
  );
  const asked = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.toLowerCase())
    .join(" | ");

  const out: string[] = [];
  const projectSource = lastAssistant?.sources?.find((source) =>
    source.id.startsWith("work:"),
  );
  if (projectSource) {
    out.push(`Tell me more about ${projectSource.label}`);
  }
  for (const question of followUpPool) {
    if (out.length >= 3) {
      break;
    }
    if (!asked.includes(question.toLowerCase().slice(0, 14))) {
      out.push(question);
    }
  }
  return out.slice(0, 3);
}

/**
 * Copy-to-clipboard button with a transient "Copied" state. When the answer
 * contains an email address (e.g. a contact reply), it copies just the email so
 * it's ready to paste — otherwise it copies the full answer.
 */
function CopyAnswer({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const email = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/u)?.[0];
  const value = email ?? text;
  return (
    <button
      className="agent-copy"
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      }}
      type="button"
    >
      {copied ? "Copied" : email ? "Copy email" : "Copy"}
    </button>
  );
}

export function PortfolioAgent({ projects }: PortfolioAgentProps) {
  // Conversation lives in a shared provider so it survives navigation between
  // the inline (home) and floating (other pages) assistant instances.
  const { messages, setMessages, nextId, reset } = useAssistant();
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [reduced, setReduced] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typing, setTyping] = useState<TypingState>(null);
  // Start from the latest known message so remounting (e.g. after navigation)
  // never re-runs the typewriter over already-shown replies.
  const lastTypedId = useRef(messages[messages.length - 1]?.id ?? 1);
  const rotatingPlaceholders = assistantContent.suggestedQuestions;

  // In-chat "interested?" capture (reuses the contact endpoint + Resend).
  const [captureOpen, setCaptureOpen] = useState(false);
  const [captureName, setCaptureName] = useState("");
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureNote, setCaptureNote] = useState("");
  const [captureStatus, setCaptureStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [captureError, setCaptureError] = useState("");

  async function submitCapture(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (captureStatus === "sending") {
      return;
    }
    if (captureNote.trim().length < 20) {
      setCaptureError("Add a sentence or two (at least 20 characters).");
      return;
    }
    setCaptureStatus("sending");
    setCaptureError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: captureName.trim() || "Recruiter",
          email: captureEmail.trim(),
          company: "",
          role: "Via portfolio assistant",
          message: captureNote.trim(),
          website: "",
        }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Could not send that right now.");
      }
      trackEvent("assistant_capture");
      setCaptureStatus("sent");
    } catch (err) {
      setCaptureStatus("error");
      setCaptureError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  // Keep the latest message (the question, "thinking", and the reply) in view
  // so it is obvious the assistant responded. Respects reduced-motion via the
  // transcript's CSS scroll-behavior.
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isAsking]);

  // Detect reduced-motion (gates the typewriter reveal + placeholder cycle).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Start a typewriter reveal when a fresh assistant reply arrives.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || last.id <= lastTypedId.current) {
      return;
    }
    lastTypedId.current = last.id;
    // Streamed replies animate as they arrive, so skip the typewriter for them.
    if (!reduced && !last.streamed) {
      setTyping({ id: last.id, len: 0 });
    }
  }, [messages, reduced]);

  // Advance the typewriter and keep the reveal scrolled into view.
  useEffect(() => {
    if (!typing) {
      return;
    }
    const message = messages.find((item) => item.id === typing.id);
    if (!message || typing.len >= message.content.length) {
      setTyping(null);
      return;
    }
    const step = Math.max(2, Math.ceil(message.content.length / 60));
    const timer = window.setTimeout(() => {
      setTyping((current) =>
        current
          ? { ...current, len: Math.min(message.content.length, current.len + step) }
          : current,
      );
      const el = transcriptRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 18);
    return () => window.clearTimeout(timer);
  }, [typing, messages]);

  // Cycle the input placeholder through example questions while idle.
  useEffect(() => {
    if (reduced || focused || input !== "" || isAsking) {
      return;
    }
    const id = window.setInterval(() => {
      setPlaceholderIndex((value) => (value + 1) % rotatingPlaceholders.length);
    }, 2900);
    return () => window.clearInterval(id);
  }, [reduced, focused, input, isAsking, rotatingPlaceholders.length]);

  // Auto-grow the ask field so a pasted job description stays fully visible as
  // you type or paste, then scrolls once it hits the cap.
  useEffect(() => {
    const field = inputRef.current;
    if (!field) {
      return;
    }
    field.style.height = "auto";
    field.style.height = `${Math.min(field.scrollHeight, 220)}px`;
  }, [input]);

  // Press "/" anywhere to jump to the Ask field (unless already typing somewhere).
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const node = document.activeElement as HTMLElement | null;
      const tag = node?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || node?.isContentEditable) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({
        block: "center",
        behavior: reduced ? "auto" : "smooth",
      });
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reduced]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isAsking) {
      return;
    }

    const history = messages.slice(-6).map(({ role, content }) => ({ role, content }));
    const userMessage: AgentMessage = {
      id: nextId.current++,
      role: "user",
      content: trimmed,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsAsking(true);
    trackEvent("assistant_question", { q: trimmed.slice(0, 120) });

    const assistantId = nextId.current++;
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed, history }),
      });

      if (!response.ok) {
        throw new Error(`Agent request failed with ${response.status}`);
      }

      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("ndjson") && response.body) {
        // Live-streamed reply — append tokens as they arrive.
        setMessages((current) => [
          ...current,
          { id: assistantId, role: "assistant", content: "", streamed: true },
        ]);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let content = "";

        const applyEvent = (event: {
          type?: string;
          text?: string;
          content?: string;
          sources?: SourceLink[];
        }) => {
          if (event.type === "delta" && typeof event.text === "string") {
            content += event.text;
          } else if (event.type === "reset") {
            content = event.content ?? "";
          }
          const sources =
            event.type === "reset" || event.type === "done"
              ? event.sources
              : undefined;
          setMessages((current) =>
            current.map((message) =>
              message.id === assistantId
                ? {
                    ...message,
                    content,
                    ...(sources ? { sources } : {}),
                  }
                : message,
            ),
          );
        };

        for (;;) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          buffer += decoder.decode(value, { stream: true });
          let newlineIdx = buffer.indexOf("\n");
          while (newlineIdx >= 0) {
            const line = buffer.slice(0, newlineIdx).trim();
            buffer = buffer.slice(newlineIdx + 1);
            if (line) {
              try {
                applyEvent(
                  JSON.parse(line) as {
                    type?: string;
                    text?: string;
                    content?: string;
                    sources?: SourceLink[];
                  },
                );
              } catch {
                // ignore a malformed line
              }
            }
            newlineIdx = buffer.indexOf("\n");
          }
          const el = transcriptRef.current;
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        }

        if (!content.trim()) {
          throw new Error("Empty streamed answer");
        }
      } else {
        // Instant JSON reply (deterministic answers) — typewriter reveals it.
        const answer = readAgentAnswer(await response.json());
        if (!answer) {
          throw new Error("Agent response did not match the expected shape");
        }
        setMessages((current) => [
          ...current,
          {
            id: assistantId,
            role: "assistant",
            content: answer.content,
            sources: answer.sources,
          },
        ]);
      }
    } catch {
      const answer = answerPortfolioQuestion(trimmed, projects);
      const localMessage: AgentMessage = {
        id: assistantId,
        role: "assistant",
        content: `I could not reach the AI endpoint, so I am using the local site index.\n${answer.content}`,
        sources: answer.sources,
        streamed: true,
      };
      setMessages((current) =>
        current.some((message) => message.id === assistantId)
          ? current.map((message) =>
              message.id === assistantId ? localMessage : message,
            )
          : [...current, localMessage],
      );
    } finally {
      setIsAsking(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  function resetChat() {
    if (isAsking) {
      return;
    }
    reset();
    setInput("");
    setTyping(null);
    // Allow the typewriter to run again for the next reply after a reset.
    lastTypedId.current = 1;
    inputRef.current?.focus();
  }

  function primeJobMatch() {
    setInput("Match yourself to this job description: ");
    const field = inputRef.current;
    if (field) {
      field.focus();
      const end = field.value.length;
      window.setTimeout(() => field.setSelectionRange(end, end), 0);
    }
  }

  return (
    <section aria-labelledby="agent-title" className="agent-card" id="ask-hany">
      <div className="agent-topline">
        <div className="agent-id">
          <span aria-hidden="true" className="agent-avatar">
            <span className="agent-avatar-core" />
          </span>
          <div>
            <p className="caps" id="agent-title">
              {assistantContent.eyebrow}
            </p>
            <h2>{assistantContent.title}</h2>
          </div>
        </div>
        <div className="agent-topline-right">
          {messages.length > 1 ? (
            <button
              className="agent-reset"
              disabled={isAsking}
              onClick={resetChat}
              title="Clear this conversation"
              type="button"
            >
              <span aria-hidden="true">↺</span> New chat
            </button>
          ) : null}
        </div>
      </div>

      <div
        aria-busy={isAsking}
        aria-live="polite"
        className="agent-transcript"
        ref={transcriptRef}
      >
        {messages.map((message) => {
          // Non-null only for the message currently being revealed.
          const reveal = typing && typing.id === message.id ? typing : null;
          const roleLabel = message.role === "assistant" ? "Hany" : "You";
          return (
            <article className={`agent-message ${message.role}`} key={message.id}>
              <p className="agent-role">{roleLabel}</p>
              {reveal ? (
                <>
                  {/* Visual typewriter — hidden from screen readers so the
                      live region is not spammed with partial text. */}
                  <div aria-hidden="true">
                    <AgentAnswerBody
                      content={`${message.content.slice(0, reveal.len)}▌`}
                    />
                  </div>
                  {/* Full answer for assistive tech, announced once. */}
                  <div className="sr-only">
                    <AgentAnswerBody content={message.content} />
                  </div>
                </>
              ) : (
                <>
                  <AgentAnswerBody content={message.content} />
                  <AgentAnswerSources
                    projects={projects}
                    sources={message.sources}
                  />
                  {message.role === "assistant" && message.id !== 1 ? (
                    <div className="agent-msg-tools">
                      <CopyAnswer text={message.content} />
                    </div>
                  ) : null}
                </>
              )}
            </article>
          );
        })}

        {isAsking &&
        !(
          messages[messages.length - 1]?.role === "assistant" &&
          (messages[messages.length - 1]?.content.length ?? 0) > 0
        ) ? (
          <article aria-hidden="true" className="agent-message assistant typing-bubble">
            <p className="agent-role">Hany</p>
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </article>
        ) : null}
      </div>

      {messages.length <= 1 ? (
        <div className="agent-suggestions" aria-label="Suggested questions">
          {assistantContent.suggestedQuestions.map((question, index) => (
            <button
              disabled={isAsking}
              key={question}
              onClick={() => void ask(question)}
              style={{ "--i": index } as CSSProperties}
              type="button"
            >
              {question}
            </button>
          ))}
        </div>
      ) : !isAsking &&
        messages[messages.length - 1]?.role === "assistant" ? (
        <div className="agent-followups" aria-label="Follow-up suggestions">
          {computeFollowUps(messages).map((question) => (
            <button
              className="agent-chip"
              key={question}
              onClick={() => void ask(question)}
              type="button"
            >
              {question}
            </button>
          ))}
          <button
            className="agent-chip agent-chip-action"
            onClick={primeJobMatch}
            type="button"
          >
            Match a job description
          </button>
          <button
            aria-expanded={captureOpen}
            className="agent-chip agent-chip-action"
            onClick={() => setCaptureOpen((value) => !value)}
            type="button"
          >
            Interested? Notify Hany
          </button>
        </div>
      ) : null}

      {captureOpen && messages.length > 1 ? (
        captureStatus === "sent" ? (
          <p className="agent-capture-sent" role="status">
            Sent — Hany will follow up by email. Thanks for reaching out.
          </p>
        ) : (
          <form className="agent-capture" onSubmit={(event) => void submitCapture(event)}>
            <div className="agent-capture-row">
              <label className="sr-only" htmlFor="capture-name">
                Your name
              </label>
              <input
                autoComplete="name"
                id="capture-name"
                onChange={(event) => setCaptureName(event.target.value)}
                placeholder="Name (optional)"
                type="text"
                value={captureName}
              />
              <label className="sr-only" htmlFor="capture-email">
                Your email
              </label>
              <input
                autoComplete="email"
                id="capture-email"
                onChange={(event) => setCaptureEmail(event.target.value)}
                placeholder="you@company.com"
                required
                type="email"
                value={captureEmail}
              />
            </div>
            <label className="sr-only" htmlFor="capture-note">
              Your note
            </label>
            <textarea
              id="capture-note"
              onChange={(event) => setCaptureNote(event.target.value)}
              placeholder="A quick note — the role and why you're reaching out."
              required
              rows={2}
              value={captureNote}
            />
            <div className="agent-capture-actions">
              <button disabled={captureStatus === "sending"} type="submit">
                {captureStatus === "sending" ? "Sending…" : "Send to Hany"}
              </button>
              {captureError ? (
                <span className="agent-capture-error" role="alert">
                  {captureError}
                </span>
              ) : null}
            </div>
          </form>
        )
      ) : null}

      {isAsking ? (
        <p className="sr-only" role="status">
          {assistantContent.thinkingStatus}
        </p>
      ) : null}

      <form className="agent-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="agent-question">
          {assistantContent.inputLabel}
        </label>
        <textarea
          autoComplete="off"
          disabled={isAsking}
          id="agent-question"
          onBlur={() => setFocused(false)}
          onChange={(event) => setInput(event.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(event) => {
            // Enter sends; Shift+Enter inserts a newline (for pasting a JD).
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void ask(input);
            }
          }}
          placeholder={
            focused || input !== "" || reduced
              ? assistantContent.inputPlaceholder
              : (rotatingPlaceholders[placeholderIndex] ??
                assistantContent.inputPlaceholder)
          }
          ref={inputRef}
          rows={1}
          value={input}
        />
        <button disabled={isAsking} type="submit">
          {isAsking ? "Thinking" : "Ask"}
        </button>
        <p className="agent-hint" aria-hidden="true">
          <kbd>/</kbd> to focus <span className="agent-hint-sep">·</span>{" "}
          <kbd>Enter</kbd> to send <span className="agent-hint-sep">·</span>{" "}
          <kbd>Shift</kbd>+<kbd>Enter</kbd> for a new line
        </p>
      </form>
    </section>
  );
}
