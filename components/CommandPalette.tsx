"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * CommandPalette
 *
 * A keyboard-first command menu (Cmd/Ctrl-K) for jumping to pages and case
 * studies, toggling the theme, and copying contact details. Implemented as an
 * accessible combobox + listbox (aria-activedescendant), with focus trapped to
 * the search field, Esc to dismiss, and body scroll locked while open.
 *
 * Opens via the Cmd/Ctrl-K shortcut or the "hj:command-open" window event
 * (dispatched by CommandMenuButton, so the trigger can live in the Nav without
 * coupling). Purely additive — it reads existing site data and never mutates it.
 *
 * Used by: app/layout.tsx (overlay) + components/Nav.tsx (trigger button)
 */

const OPEN_EVENT = "hj:command-open";
const THEME_EVENT = "hj:theme-change";

export interface CommandLink {
  label: string;
  href: string;
  hint?: string;
}

export interface CommandPaletteProps {
  pages: CommandLink[];
  projects: CommandLink[];
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}

type Section = "Pages" | "Projects" | "Actions";

interface Command {
  id: string;
  label: string;
  section: Section;
  hint?: string;
  keywords?: string;
  run: () => void;
}

function Icon({ name }: { name: string }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3-3" />
        </svg>
      );
    case "page":
      return (
        <svg {...common}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
        </svg>
      );
    case "project":
      return (
        <svg {...common}>
          <path d="m16 18 4-6-4-6" />
          <path d="m8 6-4 6 4 6" />
        </svg>
      );
    case "theme":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      );
    case "copy":
      return (
        <svg {...common}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h8" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M14 4h6v6" />
          <path d="M20 4 10 14" />
          <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
        </svg>
      );
    case "enter":
      return (
        <svg {...common}>
          <path d="M9 10 4 15l5 5" />
          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
      );
    default:
      return null;
  }
}

export function CommandPalette({
  pages,
  projects,
  email,
  github,
  linkedin,
  resume,
}: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const baseId = useId();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setFeedback(null);
  }, []);

  const go = useCallback(
    (href: string) => {
      if (/^(https?:|mailto:)/u.test(href) || href.endsWith(".pdf")) {
        window.open(href, href.startsWith("mailto:") ? "_self" : "_blank", "noopener,noreferrer");
      } else {
        router.push(href);
      }
      close();
    },
    [router, close],
  );

  const toggleTheme = useCallback(() => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("hj-theme", next);
    } catch {
      /* ignore storage errors */
    }
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
    setFeedback(`Switched to ${next} mode`);
    window.setTimeout(close, 700);
  }, [close]);

  const copyEmail = useCallback(() => {
    void navigator.clipboard?.writeText(email).then(
      () => {
        setFeedback("Email copied to clipboard");
        window.setTimeout(close, 900);
      },
      () => setFeedback("Could not copy — email is " + email),
    );
  }, [email, close]);

  const commands = useMemo<Command[]>(() => {
    const pageCmds: Command[] = pages.map((page, index) => ({
      id: `page-${index}`,
      label: page.label,
      section: "Pages",
      hint: page.hint,
      run: () => go(page.href),
    }));
    const projectCmds: Command[] = projects.map((project, index) => ({
      id: `project-${index}`,
      label: project.label,
      section: "Projects",
      hint: project.hint,
      keywords: "project work case study",
      run: () => go(project.href),
    }));
    const actionCmds: Command[] = [
      {
        id: "action-theme",
        label: "Toggle light / dark theme",
        section: "Actions",
        keywords: "dark light mode appearance",
        run: toggleTheme,
      },
      {
        id: "action-copy-email",
        label: "Copy email address",
        section: "Actions",
        hint: email,
        keywords: "contact clipboard",
        run: copyEmail,
      },
      {
        id: "action-email",
        label: "Email Hany",
        section: "Actions",
        keywords: "contact message mailto",
        run: () => go(`mailto:${email}`),
      },
      {
        id: "action-resume",
        label: "Open résumé (PDF)",
        section: "Actions",
        keywords: "cv download",
        run: () => go(resume),
      },
      {
        id: "action-github",
        label: "Open GitHub",
        section: "Actions",
        keywords: "code repositories",
        run: () => go(github),
      },
      {
        id: "action-linkedin",
        label: "Open LinkedIn",
        section: "Actions",
        keywords: "profile network",
        run: () => go(linkedin),
      },
    ];
    return [...pageCmds, ...projectCmds, ...actionCmds];
  }, [pages, projects, email, github, linkedin, resume, go, toggleTheme, copyEmail]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return commands;
    }
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ""} ${command.section} ${command.keywords ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [commands, query]);

  // Keep the active index in range as the result set changes.
  useEffect(() => {
    setActive((current) => (current >= filtered.length ? 0 : current));
  }, [filtered.length]);

  // Global open shortcut + custom open event.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Open/close side effects: focus, scroll lock, focus restore.
  useEffect(() => {
    const root = document.documentElement;
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      root.dataset.paletteOpen = "true";
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setActive(0);
      const raf = window.requestAnimationFrame(() => inputRef.current?.focus());
      return () => {
        window.cancelAnimationFrame(raf);
        document.body.style.overflow = previousOverflow;
        delete root.dataset.paletteOpen;
      };
    }
    restoreFocusRef.current?.focus?.();
    return undefined;
  }, [open]);

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open) {
      return;
    }
    const node = listRef.current?.querySelector<HTMLElement>(
      `#${baseId}-opt-${active}`,
    );
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open, baseId, filtered]);

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(filtered.length - 1, current + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      filtered[active]?.run();
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      event.preventDefault();
    } else if (event.key === "Home") {
      event.preventDefault();
      setActive(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setActive(filtered.length - 1);
    }
  }

  if (!open) {
    return null;
  }

  let renderedSection: Section | null = null;

  return (
    <div
      className="cmdk-overlay"
      onMouseDown={close}
      role="presentation"
    >
      <div
        aria-label="Command menu"
        aria-modal="true"
        className="cmdk-panel"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="cmdk-input-row">
          <span className="cmdk-search-icon">
            <Icon name="search" />
          </span>
          <input
            aria-activedescendant={
              filtered[active] ? `${baseId}-opt-${active}` : undefined
            }
            aria-autocomplete="list"
            aria-controls={`${baseId}-list`}
            aria-expanded="true"
            autoComplete="off"
            className="cmdk-input"
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search pages, projects, actions..."
            ref={inputRef}
            role="combobox"
            spellCheck={false}
            type="text"
            value={query}
          />
          <kbd className="cmdk-esc">Esc</kbd>
        </div>

        <ul className="cmdk-list" id={`${baseId}-list`} ref={listRef} role="listbox">
          {filtered.length === 0 ? (
            <li className="cmdk-empty" role="presentation">
              No matches for “{query}”.
            </li>
          ) : (
            filtered.map((command, index) => {
              const showHeader = command.section !== renderedSection;
              renderedSection = command.section;
              const isActive = index === active;
              return (
                <li key={command.id} role="presentation">
                  {showHeader ? (
                    <div className="cmdk-section" role="presentation">
                      {command.section}
                    </div>
                  ) : null}
                  <div
                    aria-selected={isActive}
                    className={`cmdk-option${isActive ? " is-active" : ""}`}
                    id={`${baseId}-opt-${index}`}
                    onClick={() => command.run()}
                    onMouseMove={() => setActive(index)}
                    role="option"
                  >
                    <span className="cmdk-option-icon">
                      <Icon
                        name={
                          command.section === "Pages"
                            ? "page"
                            : command.section === "Projects"
                              ? "project"
                              : command.id === "action-theme"
                                ? "theme"
                                : command.id === "action-copy-email"
                                  ? "copy"
                                  : command.id === "action-email"
                                    ? "mail"
                                    : "external"
                        }
                      />
                    </span>
                    <span className="cmdk-option-label">{command.label}</span>
                    {command.hint ? (
                      <span className="cmdk-option-hint">{command.hint}</span>
                    ) : null}
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <div aria-live="polite" className="cmdk-footer">
          {feedback ? (
            <span className="cmdk-feedback">{feedback}</span>
          ) : (
            <>
              <span className="cmdk-foot-item">
                <Icon name="enter" /> select
              </span>
              <span className="cmdk-foot-item">↑↓ navigate</span>
              <span className="cmdk-foot-item">esc close</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * CommandMenuButton
 *
 * Small Nav trigger that opens the palette via a window event, so it can sit in
 * the (server-rendered) Nav without importing the stateful palette directly.
 */
export function CommandMenuButton() {
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/u.test(navigator.platform));
  }, []);

  return (
    <button
      aria-keyshortcuts="Meta+K Control+K"
      aria-label="Open command menu"
      className="cmdk-trigger"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      type="button"
    >
      <Icon name="search" />
      <span className="cmdk-trigger-label">Search</span>
      <kbd className="cmdk-trigger-kbd">{isMac ? "⌘" : "Ctrl"}K</kbd>
    </button>
  );
}
