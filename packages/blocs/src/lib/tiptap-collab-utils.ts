/**
 * Tiptap Collaboration utilities.
 * Apps can override fetchCollabToken and set TIPTAP_COLLAB_APP_ID for production.
 */

import { getUrlParam, getAvatar } from "@/utils/collab-helper"

export { getUrlParam, getAvatar }

export const TIPTAP_COLLAB_DOC_PREFIX = "default-"
/** Set in app env for production; empty allows local-only (no collab server). */
export const TIPTAP_COLLAB_APP_ID =
  (typeof process !== "undefined" && process.env?.TIPTAP_COLLAB_APP_ID) || ""

/**
 * Fetches a JWT token for Tiptap Collaboration.
 * Returns empty string by default so demo works without env; apps can override for production.
 */
export async function fetchCollabToken(): Promise<string> {
  return ""
}
