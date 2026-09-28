# ViboraQ Phase 3.8

## Front landing redesign
- Reworked the public landing page around the approved cinematic/glossy reference direction.
- Dark plum/rose glassmorphism with an optional Pearl appearance toggle.
- Romantic couple hero imagery, four interactive profile cards, and glass sign-in preview.
- Clicking profile cards, sign-in, Join Free, or login-preview controls opens the existing Supabase auth flow.
- Live Radar uses Supabase Realtime Presence for the current connected-session count.
- Added city activity presentation, Stories, Safety, discovery and premium CTA sections.
- Responsive mobile layout keeps the cinematic landing but changes into a compact app-like flow.

## Important
- The city figures in the landing presentation are visual labels; only the global Live Radar count is live from Realtime Presence in this build.
- Google/Apple buttons in the visual login preview open the existing email/password auth flow; OAuth providers are not silently enabled.
