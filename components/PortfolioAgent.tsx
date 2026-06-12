"use client";

import Link from "next/link";
import type { FormEvent } from "react";
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

interface AgentMessage extends AgentHistoryMessage {
  id: number;
  sources?: SourceLink[];
}

interface PortfolioAgentProps {
  projects: AgentProject[];
}

const suggestedQuestions = [
  "What has Hany built with AI?",
  "Which project shows full-stack work?",
  "Match Hany to a job description",
  "Where is Hany based?",
  "Is Hany open to Winter 2027 co-op?",
  "What tech stack does Hany use?",
  "How can I contact Hany?",
];

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
      content:
        "Ask me about Hany's projects, stack, resume, or co-op fit. I answer from the content on this site and link the sources I used.",
      sources: [profileSource, allWorkSource],
    },
  ]);
  const [input, setInput] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const nextId = useRef(2);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const projectCount = useMemo(() => projects.length, [projects.length]);

  // Keep the latest message (the question, "thinking", and the reply) in view
  // so it is obvious the assistant responded. Respects reduced-motion via the
  // transcript's CSS scroll-behavior.
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isAsking]);

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
        <div>
          <p className="caps" id="agent-title">
            Portfolio assistant
          </p>
          <h2>Ask Hany</h2>
        </div>
        <p className="agent-fact">{projectCount} case studies indexed</p>
      </div>

      <div
        aria-busy={isAsking}
        aria-live="polite"
        className="agent-transcript"
        ref={transcriptRef}
      >
        {messages.map((message) => (
          <article className={`agent-message ${message.role}`} key={message.id}>
            <p className="agent-role">
              {message.role === "assistant" ? "Assistant" : "You"}
            </p>
            {message.content.split("\n").map((line, index) => (
              <p key={`${message.id}-line-${index}`}>{line}</p>
            ))}
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
          </article>
        ))}
      </div>

      <div className="agent-suggestions" aria-label="Suggested questions">
        {suggestedQuestions.map((question) => (
          <button
            disabled={isAsking}
            key={question}
            onClick={() => void ask(question)}
            type="button"
          >
            {question}
          </button>
        ))}
      </div>

      {isAsking ? (
        <p className="agent-status" role="status">
          Thinking...
        </p>
      ) : null}

      <form className="agent-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="agent-question">
          Ask a question about Hany
        </label>
        <input
          autoComplete="off"
          disabled={isAsking}
          id="agent-question"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about projects, stack, resume, or co-op fit..."
          type="text"
          value={input}
        />
        <button disabled={isAsking} type="submit">
          {isAsking ? "Thinking" : "Ask"}
        </button>
      </form>
    </section>
  );
}
