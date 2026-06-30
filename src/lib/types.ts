/* Shared types used by the API routes, hooks, and components. */

export type Severity = "low" | "medium" | "high";

export type Finding = {
  quote: string;
  rule: string;
  title: string;
  severity: Severity;
  explanation: string;
  rewrite: string;
};

export type CheckResult = {
  score: number;
  summary: string;
  findings: Finding[];
};

export type SocialProvider = "facebook" | "instagram";

/** A connectable target: a Facebook Page or a linked Instagram business account. */
export type SocialAccount = {
  /** Stable target key, e.g. "fb:<pageId>" or "ig:<igUserId>". */
  target: string;
  provider: SocialProvider;
  id: string;
  name: string;
  /** Whether posts on this target can be edited in place via the API. */
  canEdit: boolean;
};

export type SocialPost = {
  id: string;
  provider: SocialProvider;
  text: string;
  permalink?: string;
  timestamp?: string;
  /** Facebook page posts can be edited; Instagram captions cannot. */
  canEdit: boolean;
};

export type AuthStatus = {
  /** Whether the server has Meta app credentials configured. */
  configured: boolean;
  connected: boolean;
  name?: string;
};
