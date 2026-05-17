import React from "react";
import { codeToHtml } from "shiki";
import { CopyButton } from "@/components/CopyButton";

/**
 * CodeBlock
 *
 * Syntax-highlights fenced MDX code at render time and adds a small copy
 * control without client-side highlighting.
 *
 * Used by: mdx-components.tsx
 */
export interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

interface CodeNodeProps {
  children?: React.ReactNode;
  className?: string;
}

function getCodeNode(children: React.ReactNode): React.ReactElement<CodeNodeProps> | null {
  if (React.isValidElement<CodeNodeProps>(children)) {
    return children;
  }
  return null;
}

function getText(node: React.ReactNode): string {
  if (typeof node === "string") {
    return node;
  }
  if (typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getText).join("");
  }
  return "";
}

/**
 * Extracts code text and language from the MDX pre/code node pair.
 */
function parseCodeProps(children: React.ReactNode, className?: string): { code: string; language: string } {
  const codeNode = getCodeNode(children);
  const codeClassName = codeNode?.props.className ?? className ?? "";
  const languageMatch = /language-([a-z0-9_-]+)/iu.exec(codeClassName);
  return {
    code: getText(codeNode?.props.children ?? children).trimEnd(),
    language: languageMatch?.[1] ?? "text",
  };
}

export async function CodeBlock({ children, className }: CodeBlockProps) {
  const { code, language } = parseCodeProps(children, className);
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-light",
  });

  return (
    <div className="relative my-6 overflow-hidden rounded-md border border-rule bg-surface">
      <CopyButton text={code} />
      <div className="code-html" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
