"use client";

import { useState } from "react";

/**
 * CopyButton
 *
 * Copies server-rendered code block text to the clipboard.
 *
 * Used by: components/CodeBlock.tsx
 */
export interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      className="absolute right-2 top-2 rounded-sm border border-rule bg-paper px-2 py-1 font-mono text-[0.7rem] leading-none text-ink-muted hover:text-accent"
      onClick={() => {
        void copy();
      }}
      type="button"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
