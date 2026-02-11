import { defineEventHandler, getHeader, getRequestURL, sendRedirect } from 'h3'

const TARGET_ORIGIN = 'https://plugins.astrbot.app'

export default defineEventHandler((event) => {
  // Avoid breaking local development.
  if (import.meta.dev) {
    return
  }

  const host = (getHeader(event, 'host') ?? '').split(':')[0]?.toLowerCase()
  // Prevent redirect loops when already on target domain.
  if (host === 'plugins.astrbot.app') {
    return
  }

  // Always redirect to the root of the target site.
  // (Do not preserve path or query params.)
  const url = getRequestURL(event)
  void url
  const target = new URL('/', TARGET_ORIGIN)

  return sendRedirect(event, target.toString(), 301)
})
