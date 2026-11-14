import { createOnRequestError } from "@posthog/next"

import { getPostHogServer } from "./lib/posthog-server"

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    getPostHogServer()
  }
}

export const onRequestError =
  posthogKey && posthogHost
    ? createOnRequestError({
        apiKey: posthogKey,
        host: posthogHost,
      })
    : () => {}
