"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * TrackView
 *
 * Fires a Vercel Analytics custom event once when it mounts. Used to record
 * case-study views (which projects recruiters open). Renders nothing.
 */
export function TrackView({
  event,
  props,
}: {
  event: string;
  props?: Record<string, string>;
}) {
  const key = props ? JSON.stringify(props) : "";
  useEffect(() => {
    trackEvent(event, props ? (JSON.parse(key) as Record<string, string>) : undefined);
  }, [event, key]);
  return null;
}
