import { GoogleChat } from "./google/index.js"

/**
 * Export your main functions and classes here.
 */
export function newChat(c, opts) {
  // todo: return different chat handlers based on opts.platform
  return new GoogleChat(c, opts)
}