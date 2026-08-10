import type { AgentHistoryMessage } from "@/lib/portfolio-agent";

/**
 * Pure guard + grounding helpers for the portfolio agent route.
 *
 * Extracted from app/api/agent/route.ts so the security-critical logic
 * (prompt-injection filtering, output redaction, answer grounding, request
 * sanitization) can be unit-tested in isolation. No I/O, no secrets, no
 * framework imports — safe to import anywhere.
 */

export const maxQuestionLength = 8_000;
export const maxHistoryTurns = 4;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** A source document, narrowed to only what grounding needs. */
export interface GroundingDocument {
  source: { id: string };
  text: string;
}

export const blockedQuestionPatterns = [
  /\b(ignore|disregard|forget|override)\b.{0,60}\b(previous|prior|above|system|developer|instruction|instructions|rules?)\b/iu,
  /\b(reveal|show|print|leak|dump|exfiltrate|extract|tell me)\b.{0,80}\b(system prompt|developer message|hidden prompt|instructions|api key|secret|environment|env|gemini_api_key)\b/iu,
  /\b(system prompt|developer message|hidden prompt|hidden instructions|gemini_api_key|process\.env|\.env|api key|secret key|jailbreak|dan mode|do anything now)\b/iu,
  /\bnew instructions\b/iu,
];

export const blockedOutputPatterns = [
  /\bGEMINI_API_KEY\b/iu,
  /\bprocess\.env\b/iu,
  /\b\.env(?:\.local)?\b/iu,
  /\bsystemInstruction\b/iu,
  /\b(system prompt|developer message|hidden prompt|hidden instructions|api key|secret key)\b/iu,
];

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "have",
  "he",
  "his",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "with",
]);

const allowedGroundingTokens = new Set([
  "answer",
  "answers",
  "available",
  "based",
  "case",
  "clearest",
  "current",
  "currently",
  "does",
  "doesn",
  "example",
  "examples",
  "hany",
  "jiang",
  "mention",
  "mentions",
  "not",
  "portfolio",
  "project",
  "projects",
  "site",
  "source",
  "sources",
  "strongest",
  "study",
  "studies",
  "work",
  // Generic connective / explanatory words a fluent answer naturally uses.
  // These carry no specific factual claim, so allowing them lets the model
  // phrase answers in natural language without tripping the grounding check.
  "about",
  "across",
  "also",
  "approach",
  "best",
  "both",
  "build",
  "builds",
  "building",
  "built",
  "combine",
  "combines",
  "create",
  "created",
  "creates",
  "demonstrate",
  "demonstrates",
  "design",
  "designed",
  "develop",
  "developed",
  "experience",
  "feature",
  "features",
  "focus",
  "focused",
  "focuses",
  "help",
  "helps",
  "include",
  "includes",
  "including",
  "made",
  "make",
  "makes",
  "notable",
  "open",
  "recruiting",
  "recruiter",
  "recruiters",
  "role",
  "seeking",
  "shows",
  "stack",
  "strong",
  "tool",
  "tools",
  "use",
  "used",
  "uses",
  "using",
  "various",
  "worked",
  "working",
]);

export function hasBlockedQuestion(question: string): boolean {
  return blockedQuestionPatterns.some((pattern) => pattern.test(question));
}

export function hasBlockedOutput(content: string): boolean {
  return blockedOutputPatterns.some((pattern) => pattern.test(content));
}

function stemToken(token: string): string {
  if (token.length > 4 && token.endsWith("s")) {
    return token.slice(0, -1);
  }

  return token;
}

export function tokenizeForGrounding(value: string): string[] {
  return (value.toLowerCase().match(/[a-z0-9+#.]+/gu) ?? [])
    .map(stemToken)
    .filter((token) => token.length > 2 && !stopWords.has(token));
}

export function isGroundedContent(
  content: string,
  sourceIds: string[],
  sourceDocuments: GroundingDocument[],
): boolean {
  const selectedText = sourceDocuments
    .filter((document) => sourceIds.includes(document.source.id))
    .map((document) => document.text)
    .join(" ");
  const sourceTokens = new Set(tokenizeForGrounding(selectedText));
  const answerTokens = Array.from(new Set(tokenizeForGrounding(content)));
  const unsupportedTokens = answerTokens.filter(
    (token) => !sourceTokens.has(token) && !allowedGroundingTokens.has(token),
  );

  // Allow natural rephrasing: reject only when a large share of the answer's
  // substantive words are absent from the cited sources (i.e. likely invented),
  // not merely because the model paraphrased rather than copied verbatim.
  return unsupportedTokens.length <= Math.max(6, Math.floor(answerTokens.length * 0.5));
}

export function readQuestion(payload: unknown): string | undefined {
  if (!isRecord(payload) || typeof payload.question !== "string") {
    return undefined;
  }

  const trimmed = payload.question.trim().slice(0, maxQuestionLength);
  return trimmed.length > 0 ? trimmed : undefined;
}

export function readHistory(payload: unknown): AgentHistoryMessage[] {
  if (!isRecord(payload) || !Array.isArray(payload.history)) {
    return [];
  }

  return payload.history
    .flatMap((item): AgentHistoryMessage[] => {
      if (!isRecord(item) || typeof item.content !== "string" || item.role !== "user") {
        return [];
      }

      return [
        {
          role: item.role,
          content: item.content.trim().slice(0, 1000),
        },
      ];
    })
    .filter((item) => item.content.length > 0)
    .filter((item) => !hasBlockedQuestion(item.content))
    .slice(-maxHistoryTurns);
}
