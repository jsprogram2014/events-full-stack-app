# PostHog Error Tracking

> ⚠️ **Needs your attention**
> - Configure the production build environment with `POSTHOG_API_KEY` as a protected/masked secret and `POSTHOG_PROJECT_ID` as a variable; also provide the upload host using the name the build configuration actually reads (`NEXT_PUBLIC_POSTHOG_HOST`), and resolve the current `POSTHOG_HOST` versus `NEXT_PUBLIC_POSTHOG_HOST` contract mismatch before deploying.
> - This repository has no CI or deployment configuration, so apply those variables wherever `npm run build` runs. Ensure the production environment also has `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` for runtime capture.
> - The deploy path could not be traced from this repository. If a hidden Docker or provider build exists, preserve commit metadata/provider git variables for release creation and pass `POSTHOG_API_KEY` through the provider's build-secret mechanism rather than a Docker `ARG` or plain `ENV`.

## What this now does

Uncaught errors reach PostHog through the existing browser exception capture and the new server-side integrations:

- `instrumentation-client.ts` already initializes the browser SDK with `capture_exceptions: true`.
- `app/global-error.tsx` captures root rendering failures that the framework swallows.
- `instrumentation.ts` starts the server client once and uses `createOnRequestError` to capture errors caught by Next.js in Server Components, Route Handlers, and Server Actions.
- `lib/posthog-server.ts` provides the guarded `posthog-node` singleton with Node exception autocapture.

The app started without this server integration; it now has `@posthog/next` and `posthog-node` installed and initialized. The existing browser setup continues to use `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST`.

## Source-map upload

Source-map upload is wired in:

- `next.config.ts`
- `package.json`
- `package-lock.json`

The production build command is:

```bash
npm run build
```

With the required upload variables available where the build runs, each production build is set up to upload matching symbol sets to PostHog and delete uploaded maps afterward. The local verification build did upload successfully, but the repository contains no CI/deploy file to configure for production. Uploads in the actual deployment therefore start once the variables are present in that build environment.

The configured upload credential names are `POSTHOG_API_KEY` and `POSTHOG_PROJECT_ID`. The credentials task also stored `POSTHOG_HOST` in `.env.local`, while the current Next.js config passes `NEXT_PUBLIC_POSTHOG_HOST` to the uploader; standardize that host variable contract before relying on an external build.

## Verification

The verified command was `npm run build`, and it passed. It created release `events-full-stack-app@945eb0528203cb82f1ff48a40ddedabc1e54b968` and uploaded 37 symbol sets (45 chunks found, deduplicated to 37; 0 skipped for already-present or oversized files). The uploader also reported 132 source-map pairs without a PostHog chunk/native debug ID; the configured symbol sets still uploaded successfully.

To verify in PostHog, trigger an error and inspect:

- Exceptions: https://us.posthog.com/project/736230/error_tracking
- Uploaded symbol sets: https://us.posthog.com/project/736230/error_tracking/configuration

The first verified symbol set is already in PostHog.

## What you still need to do

1. Configure the production build environment with the existing upload contract: protected/masked `POSTHOG_API_KEY` and `POSTHOG_PROJECT_ID`, plus the host variable standardized between `POSTHOG_HOST` and `NEXT_PUBLIC_POSTHOG_HOST`. The repository has no CI provider settings to edit, so add them wherever the production build is hosted. Also provide `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` to the production app.
2. Run `npm run build` in the real deployment environment after those variables are configured. Keep the repository's commit metadata, or forward the provider's repository/branch/commit variables through any hidden build boundary, so releases and symbol sets can be associated correctly.
3. After the next production deployment, trigger an error and check the Error Tracking pages above. If the deployment resolves a release, confirm the exception identifies the expected release and uploaded source maps produce readable stack traces.

Local runs, tests, and pull-request builds are not altered by any release-linking setup; no release-linking integration was wired in this repository.
