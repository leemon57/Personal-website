"use client";

import Link from "next/link";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  allWorkSource,
  answerPortfolioQuestion,
  profileSource,
  type AgentAnswer,
  type AgentHistoryMessage,
  type AgentProject,
  type SourceLink,
} from "@/lib/portfolio-agent";
import { assistantContent } from "@/lib/site";

interface AgentMessage extends AgentHistoryMessage {
  id: number;
  sources?: SourceLink[];
}

/** Tracks the in-progress typewriter reveal for the newest assistant reply. */
type TypingState = { id: number; len: number } | null;

interface PortfolioAgentProps {
  projects: AgentProject[];
}

/**
 * Renders an assistant/user message body, turning lines that begin with a
 * bullet marker into a real list and the rest into paragraphs. Plain text only
 * (no HTML), so it is safe to render model output directly.
 */
function renderMessageBody(content: string, id: number): ReactNode[] {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  let blockIndex = 0;

  const flushBullets = () => {
    if (bullets.length > 0) {
      const items = bullets;
      blocks.push(
        <ul className="agent-list" key={`${id}-ul-${blockIndex++}`}>
          {items.map((item, itemIndex) => (
            <li key={`${id}-li-${blockIndex}-${itemIndex}`}>{item}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };

  for (const line of lines) {
    const bullet = /^[-*•]\s+(.*)$/u.exec(line);
    if (bullet) {
      bullets.push(bullet[1] ?? "");
    } else {
      flushBullets();
      blocks.push(<p key={`${id}-p-${blockIndex++}`}>{line}</p>);
    }
  }

  flushBullets();
  return blocks;
}

function SourceAnchor({ source }: { source: SourceLink }) {
  if (source.href.startsWith("/")) {
    return <Link href={source.href}>{source.label}</Link>;
  }

  return <a href={source.href}>{source.label}</a>;
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

export function PortfolioAgent({ projects }: PortfolioAgentProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 1,
      role: "assistant",
      content: assistantContent.initialMessage,
      sources: [profileSource, allWorkSource],
    },
  ]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const nextId = useRef(2);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const projectCount = useMemo(() => projects.length, [projects.length]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [reduced, setReduced] = useState(false);
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typing, setTyping] = useState<TypingState>(null);
  const lastTypedId = useRef(1); // the seeded welcome message is already shown
  const rotatingPlaceholders = assistantContent.suggestedQuestions;

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
    if (!reduced) {
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

      const answer = readAgentAnswer(await response.json());
      if (!answer) {
        throw new Error("Agent response did not match the expected shape");
      }

      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: answer.content,
          sources: answer.sources,
        },
      ]);
    } catch {
      const answer = answerPortfolioQuestion(trimmed, projects);
      setMessages((current) => [
        ...current,
        {
          id: nextId.current++,
          role: "assistant",
          content: `I could not reach the AI endpoint, so I am using the local site index.\n${answer.content}`,
          sources: answer.sources,
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
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
        <p className="agent-fact">
          {projectCount} {assistantContent.factSuffix}
        </p>
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
          const roleLabel = message.role === "assistant" ? "Assistant" : "You";
          return (
            <article className={`agent-message ${message.role}`} key={message.id}>
              <p className="agent-role">{roleLabel}</p>
              {reveal ? (
                <>
                  {/* Visual typewriter — hidden from screen readers so the
                      live region is not spammed with partial text. */}
                  <div aria-hidden="true">
                    {renderMessageBody(
                      `${message.content.slice(0, reveal.len)}▌`,
                      message.id,
                    )}
                  </div>
                  {/* Full answer for assistive tech, announced once. */}
                  <div className="sr-only">
                    {renderMessageBody(message.content, message.id)}
                  </div>
                </>
              ) : (
                <>
                  {renderMessageBody(message.content, message.id)}
                  {message.sources && message.sources.length > 0 ? (
                    <div className="agent-sources" aria-label="Sources">
                      {message.sources.map((source) => (
                        <SourceAnchor
                          key={`${message.id}-${source.id}-${source.href}`}
                          source={source}
                        />
                      ))}
                    </div>
                  ) : null}
                </>
              )}
            </article>
          );
        })}

        {isAsking ? (
          <article aria-hidden="true" className="agent-message assistant typing-bubble">
            <p className="agent-role">Assistant</p>
            <div className="typing">
              <span />
              <span />
              <span />
            </div>
          </article>
        ) : null}
      </div>

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

      {isAsking ? (
        <p className="sr-only" role="status">
          {assistantContent.thinkingStatus}
        </p>
      ) : null}

      <form className="agent-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="agent-question">
          {assistantContent.inputLabel}
        </label>
        <input
          autoComplete="off"
          disabled={isAsking}
          id="agent-question"
          onBlur={() => setFocused(false)}
          onChange={(event) => setInput(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={
            focused || input !== "" || reduced
              ? assistantContent.inputPlaceholder
              : (rotatingPlaceholders[placeholderIndex] ??
                assistantContent.inputPlaceholder)
          }
          ref={inputRef}
          type="text"
          value={input}
        />
        <button disabled={isAsking} type="submit">
          {isAsking ? "Thinking" : "Ask"}
        </button>
        <p className="agent-hint" aria-hidden="true">
          <kbd>/</kbd> to focus <span className="agent-hint-sep">·</span>{" "}
          <kbd>Enter</kbd> to send
        </p>
      </form>
    </section>
  );
}
