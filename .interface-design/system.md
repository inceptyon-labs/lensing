# Lensing Design System

> A surface that bends information into clarity.

## Intent

**Who:** A person at home — glancing from across a room at 7am with coffee, checking scores at dinner, noticing an alert at midnight. Not sitting at a desk. Not actively using. Observing.

**Task:** Absorb information at a glance. Weather, calendar, crypto, news — pulled into focus by gravity, not demanded by interface.

**Feel:** Like peering into deep space through a lens. Information emerges from darkness. Ambient, warm at the edges, never harsh. Always-on without fatigue.

---

## Direction

Gravitational lensing — light bends around massive objects to reveal what's hidden. The dashboard is a data gravity well. Information is pulled into view, structured by weight and urgency, glowing faintly at the boundaries where data meets void.

Not clinical. Not energetic. Ambient. A display you live with 24/7.

---

## Tokens

### Surfaces

```css
--void: hsl(240, 8%, 4%); /* true deep — page background */
--event-horizon: hsl(240, 6%, 7%); /* primary surface — cards, panels */
--accretion: hsl(240, 5%, 10%); /* elevated surface — dropdowns, modals */
--singularity: hsl(240, 4%, 13%); /* highest elevation — tooltips, popovers */
```

Near-black with a barely perceptible blue-purple undertone — deep space, not flat gray. Each step is ~3% lightness. You feel the layers more than see them.

### Text

```css
--starlight: hsl(220, 15%, 90%); /* primary text — cool white, not pure */
--dim-light: hsl(220, 10%, 62%); /* secondary text — labels, metadata */
--faint-light: hsl(220, 8%, 42%); /* tertiary — timestamps, captions */
--ghost-light: hsl(220, 6%, 28%); /* muted — disabled, placeholder */
```

Desaturated blue-white. Never pure white (#fff) — too harsh for 24/7 viewing. Primary is bright enough to read at distance, muted levels fade naturally into the void.

### Accent

```css
--ember: hsl(28, 85%, 55%); /* primary accent — warm gold-orange */
--ember-dim: hsl(28, 70%, 40%); /* accent hover/pressed */
--ember-glow: hsla(28, 85%, 55%, 0.12); /* accent background tint */
--ember-trace: hsla(28, 85%, 55%, 0.06); /* subtle accent hint */
```

From the accretion disk — the warm light that escapes a gravity well. Used sparingly: interactive focus, active states, urgent emphasis. One accent, used with intention.

### Borders

```css
--edge: hsla(220, 10%, 50%, 0.12); /* standard separation */
--edge-soft: hsla(220, 10%, 50%, 0.07); /* subtle separation */
--edge-bright: hsla(220, 10%, 50%, 0.2); /* emphasis — active panels */
--edge-focus: hsla(28, 85%, 55%, 0.4); /* focus rings — ember-tinted */
```

Borders disappear when you're not looking for them. rgba blends with whatever surface they sit on. The focus ring picks up the ember accent — the only time borders carry color.

### Semantic

```css
--alert-urgent: hsl(0, 60%, 55%); /* desaturated red — never screaming */
--alert-warning: hsl(38, 65%, 50%); /* warm amber — close to ember family */
--alert-success: hsl(160, 45%, 45%); /* muted teal-green */
--alert-info: hsl(210, 50%, 55%); /* soft blue */
```

All desaturated and warm-shifted. On a 24/7 ambient display, saturated reds and greens cause eye fatigue. These are visible but never aggressive.

### Controls

```css
--control-bg: hsl(240, 6%, 9%); /* input backgrounds — slightly darker than surface */
--control-border: hsla(220, 10%, 50%, 0.15); /* input borders */
--control-focus: hsla(28, 85%, 55%, 0.25); /* input focus border */
```

Inputs are inset — darker than their parent surface. "Type here" without heavy decoration.

---

## Depth Strategy

**Borders + edge glow.** No drop shadows.

Cards and panels use `--edge` borders. The signature treatment: a faint radial glow on card edges using `box-shadow: 0 0 <spread> <ember-trace>` — suggesting light escaping a gravity well. Visible on hover/focus, barely perceptible at rest.

```css
/* Resting card */
box-shadow: 0 0 0 1px var(--edge);

/* Hovered card — faint ember glow */
box-shadow:
  0 0 0 1px var(--edge-bright),
  0 0 20px var(--ember-trace);

/* Focused card — clear ember edge */
box-shadow:
  0 0 0 1px var(--edge-focus),
  0 0 24px hsla(28, 85%, 55%, 0.08);
```

No elevation via shadow darkness/lightness. All hierarchy comes from surface color steps.

---

## Typography

**Primary:** Inter — neutral, highly legible at distance, excellent tabular figures.

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;

/* Scale — optimized for distance viewing */
--text-xs: 0.75rem; /* 12px — timestamps, badges */
--text-sm: 0.875rem; /* 14px — metadata, labels */
--text-base: 1rem; /* 16px — body, descriptions */
--text-lg: 1.25rem; /* 20px — card titles */
--text-xl: 1.5rem; /* 24px — section headers */
--text-2xl: 2rem; /* 32px — hero metrics */
--text-3xl: 3rem; /* 48px — clock, primary display */

/* Weights — heavier for distance legibility */
--weight-normal: 400;
--weight-medium: 500; /* labels, nav items */
--weight-semi: 600; /* card titles, emphasis */
--weight-bold: 700; /* hero numbers, primary metrics */

/* Tracking */
--tracking-tight: -0.02em; /* headlines, large numbers */
--tracking-normal: 0; /* body text */
--tracking-wide: 0.04em; /* uppercase labels, small caps */

/* Leading */
--leading-tight: 1.2; /* headlines, metrics */
--leading-normal: 1.5; /* body text */
--leading-loose: 1.7; /* long-form, descriptions */
```

Heavier weights than typical — at 6+ feet viewing distance, 400-weight text vanishes. Semibold (600) is the default for titles. Bold (700) for hero numbers like clock and primary metrics.

---

## Spacing

**Base unit: 8px**

```css
--space-1: 4px; /* micro — icon gaps, inline spacing */
--space-2: 8px; /* tight — between related elements */
--space-3: 12px; /* compact — input padding, small gaps */
--space-4: 16px; /* standard — card padding, list gaps */
--space-5: 24px; /* comfortable — section gaps within cards */
--space-6: 32px; /* generous — between card groups */
--space-7: 48px; /* major — zone separation */
--space-8: 64px; /* dramatic — page-level separation */
```

---

## Border Radius

```css
--radius-sm: 4px; /* inputs, buttons, badges */
--radius-md: 8px; /* cards, panels */
--radius-lg: 12px; /* modals, large containers */
--radius-xl: 16px; /* hero elements, ambient tiles */
```

Softly curved, not sharp. Reflects the organic nature of gravitational curvature. But not fully rounded — this is a data tool, not a toy.

---

## Signature: Gravitational Edge Glow

The defining visual element. A faint warm glow at card boundaries — light bending at the edge of a gravity well.

**Implementation:**

- At rest: nearly invisible (`ember-trace` opacity)
- On hover: glow brightens subtly
- On focus/active: glow becomes the primary indicator
- On urgent cards (alerts): glow pulses slowly with `animation: pulse 4s ease-in-out infinite`

**Where it appears:**

1. Card hover states
2. Active navigation items
3. Focus rings on interactive elements
4. Urgent notification tiles (animated)
5. The main clock/time display ambient glow

The glow must never be dramatic. If someone notices "oh, a glow effect" — it's too strong. It should feel like warmth at the edge of vision.

---

## Component Patterns

### Widget Card (base)

- Background: `--event-horizon`
- Border: `1px solid var(--edge)`
- Radius: `--radius-md`
- Padding: `--space-4`
- Hover: edge glow treatment
- Error state: `--alert-urgent` tinted border, error message inside card bounds

### Metric Display

- Hero number: `--text-2xl` or `--text-3xl`, `--weight-bold`, `--starlight`
- Label below: `--text-sm`, `--weight-medium`, `--dim-light`, `--tracking-wide`
- Delta/change: small badge with semantic color, positioned after the number
- Not icon-left-number-big-label-small. Number dominates. Label grounds it. Delta contextualizes it.

### Navigation (Admin)

- Sidebar: same background as canvas (`--void`), separated by `--edge` border
- Active item: `--ember-glow` background tint, `--starlight` text, left border accent `--ember`
- Inactive: `--dim-light` text, no background
- Width: fixed, narrow — navigation supports, doesn't compete

### Navigation (Kiosk)

- Minimal or absent — kiosk is fullscreen content
- Scene indicator: subtle top-right badge showing current mode
- If present: translucent bar that fades after inactivity

---

## Animation

```css
--duration-fast: 100ms; /* micro-interactions, hover */
--duration-normal: 200ms; /* transitions, state changes */
--duration-slow: 400ms; /* page transitions, reveals */
--duration-ambient: 4s; /* ambient pulse, glow cycle */

--ease-out: cubic-bezier(0.16, 1, 0.3, 1); /* deceleration */
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1); /* symmetric */
```

Fast for interactions. Slow for ambient effects. No spring/bounce — this is a calm instrument, not a playful app.

---

## Dark Mode Notes

This IS dark mode. The default and primary experience. If a light mode is ever added:

- Invert surface scale (light base, darker elevation)
- Ember accent stays warm but may need brightness adjustment
- Edge glow becomes a subtle warm shadow instead
- All semantic colors need recalibration for light backgrounds

---

## Kiosk-Specific Rules

- No text below `--text-sm` (14px) — unreadable at distance
- Hero metrics use `--text-3xl` minimum
- Touch targets: 48px minimum (for tablet use)
- Reduce motion: respect `prefers-reduced-motion` — disable ambient pulse, keep transitions
- CSS-only animations preferred — minimize JS on Pi 3B
- Keep DOM minimal — every node costs memory on constrained hardware
