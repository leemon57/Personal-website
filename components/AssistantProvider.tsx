"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type ReactNode,
  type SetStateAction,
} from "react";
import {
  allWorkSource,
  profileSource,
  type AgentHistoryMessage,
  type SourceLink,
} from "@/lib/portfolio-agent";
import { assistantContent } from "@/lib/site";

export interface AgentMessage extends AgentHistoryMessage {
  id: number;
  sources?: SourceLink[];
  /** True for a live-streamed reply so the typewriter effect skips it. */
  streamed?: boolean;
}

function seededMessages(): AgentMessage[] {
  return [
    {
      id: 1,
      role: "assistant",
      content: assistantContent.initialMessage,
      sources: [profileSource, allWorkSource],
    },
  ];
}

const STORAGE_KEY = "hj-assistant-conversation";

interface AssistantContextValue {
  messages: AgentMessage[];
  setMessages: Dispatch<SetStateAction<AgentMessage[]>>;
  nextId: MutableRefObject<number>;
  reset: () => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

/**
 * Holds the portfolio-assistant conversation once, at the layout level, so it
 * survives client-side navigation and is shared between the inline (home) and
 * floating (other pages) assistant instances. Persisted to sessionStorage so a
 * full reload keeps it too. Lives in the layout, which does not remount on
 * navigation.
 */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<AgentMessage[]>(seededMessages);
  const nextId = useRef(2);
  const hydrated = useRef(false);

  // Restore a saved conversation on first mount (client only, after paint so
  // there is no SSR/hydration mismatch).
  useEffect(() => {
    if (hydrated.current) {
      return;
    }
    hydrated.current = true;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const saved = JSON.parse(raw) as AgentMessage[];
      if (Array.isArray(saved) && saved.length > 0) {
        setMessages(saved);
        nextId.current = Math.max(...saved.map((message) => message.id)) + 1;
      }
    } catch {
      // Ignore malformed/unavailable storage.
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }, [messages]);

  function reset() {
    setMessages(seededMessages());
    nextId.current = 2;
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <AssistantContext.Provider value={{ messages, setMessages, nextId, reset }}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant(): AssistantContextValue {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider.");
  }
  return context;
}
