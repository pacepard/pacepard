/**
 * Tiptap Collaboration utilities.
 * Apps can override fetchCollabToken and set TIPTAP_COLLAB_APP_ID for production.
 */

import { getUrlParam, getAvatar } from "@/utils/collab-helper"

export { getUrlParam, getAvatar }

/** Vite apps use VITE_TIPTAP_COLLAB_DOC_PREFIX; Node/SSR can use TIPTAP_COLLAB_DOC_PREFIX. */
export const TIPTAP_COLLAB_DOC_PREFIX =
  (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_TIPTAP_COLLAB_DOC_PREFIX) ||
  (typeof process !== "undefined" && process.env?.TIPTAP_COLLAB_DOC_PREFIX) ||
  "default-"
/** Set in app env for production; empty allows local-only (no collab server). Vite: VITE_TIPTAP_COLLAB_APP_ID. */
export const TIPTAP_COLLAB_APP_ID =
  (typeof import.meta !== "undefined" && (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_TIPTAP_COLLAB_APP_ID) ||
  (typeof process !== "undefined" && process.env?.TIPTAP_COLLAB_APP_ID) ||
  ""

/**
 * Fetches a JWT token for Tiptap Collaboration.
 * In Vite apps uses VITE_TIPTAP_COLLAB_TOKEN from env; otherwise returns empty so local-only works.
 */
export async function fetchCollabToken(): Promise<string> {
  if (typeof import.meta !== "undefined") {
    const env = (import.meta as unknown as { env?: Record<string, string> }).env
    if (env?.VITE_TIPTAP_COLLAB_TOKEN) return env.VITE_TIPTAP_COLLAB_TOKEN ?? ""
  }
  return ""
}
