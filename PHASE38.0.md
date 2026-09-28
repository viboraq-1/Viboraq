# ViboraQ Phase 3.8 — Reference Landing Match

Phase 3.8 focuses the public landing page on the supplied ViboraQ visual reference.

## Landing
- Cinematic wine / crimson / rose palette matching the supplied reference direction.
- Center-right romantic couple hero image treatment.
- Five-item top navigation with Sign in, Join Free, appearance toggle and menu.
- Live Radar pill with Supabase Realtime Presence count.
- Four front profile cards: Areeba, Zain, Hira and Usama.
- Profile cards and preview login controls open the existing Supabase auth flow.
- Glassmorphism Welcome Back panel on the right.
- Large Live Radar / city activity bar below the hero.
- Responsive mobile layout with the same visual language.
- Pearl appearance toggle retained for daytime use.

## Presence
The public landing and authenticated member experience use the same `vq38-public-radar` Presence channel. The landing tracks itself as `Unknown` so it contributes to the global connected count without inventing a city; authenticated members can contribute their profile city.

## Notes
- The reference screenshot is used as a visual design target, not as a static page image.
- Profile/hero assets are stored locally in `public/`.
- Supabase Presence still requires the project's Realtime configuration and production authorization rules.
- Full production Vite build was not verified in this environment because dependency installation timed out.
