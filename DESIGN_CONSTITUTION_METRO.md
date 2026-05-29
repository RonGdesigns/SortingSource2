# DESIGN CONSTITUTION
## Warsaw Metro — Visual Identity System
### Extracted & Codified from "Konkurs. Nazwij Nowe Pociągi." Poster

---

## 01. PHILOSOPHY

**"METRO"** — *Movement is Form. Form is Movement.*

The design language is Constructivist-Bauhaus: pure geometry serving a civic purpose. Color is not decoration — it is infrastructure. Shapes are not ornamental — they are engineering. Every composition is a diagram of motion.

**Core Tenets:**
- Flat color only. Zero gradients, zero shadows, zero texture.
- Geometry is the hero. Curves, rectangles, and silhouettes carry all meaning.
- Type is monumental. Letters function as architectural elements.
- The poster is an aerial map of transit systems.
- Cream is the canvas — never white, never off-white. Warm, printed-paper cream.

---

## 02. COLOR SYSTEM

### Primary Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-canvas` | `#EDE8DC` | Base canvas. Warm cream. Print-paper heritage. |
| `--color-transit-red` | `#D42B1E` | Dominant energy. Fills large fields. Metro line marker. |
| `--color-teal` | `#2E7E82` | Secondary large field. Depth, counterweight to red. |
| `--color-amber` | `#F0A500` | Accent stripe. Speed line. Motion marker. |
| `--color-night` | `#1A1A1F` | Near-black. Type, details, window blocks. |
| `--color-chalk` | `#EDE8DC` | Same as canvas — used inside train window frames. |

### Color Behavior Rules
- **Large fields:** Red and teal occupy 60%+ of compositions combined.
- **Accent ratio:** Amber appears only as stripe/line — never as a fill.
- **Type field:** Night-on-canvas for body. Canvas-on-night for reversed.
- **No pastels.** No tints. No transparency. Full-strength pigment only.
- **No gradients.** Color blocks have hard, geometric edges.

### Color Distribution
```
--color-transit-red: 35% of composition area
--color-teal:        25% of composition area
--color-night:       15% of composition area
--color-canvas:      20% of composition area
--color-amber:        5% (stripe/line use only)
```

---

## 03. TYPOGRAPHY

### Typeface Stack

| Role | Family | Weight | Style |
|---|---|---|---|
| **Mega Display** | `Barlow Condensed` | 900 Black | Uppercase, fills width |
| **Sub-heading** | `Barlow Condensed` | 600 SemiBold | Wide letterspacing |
| **Body / Caption** | `Barlow` | 400 Regular | Sparse, clean |
| **Label / Meta** | `Barlow` | 500 Medium | Small caps, tracked |

*Alternative if Barlow unavailable: `Oswald` Black for display, `Oswald` Regular for body.*

### Type Scale

```
--text-xs:    0.625rem   (10px) — Fine meta, logo lockup
--text-sm:    0.75rem    (12px) — Captions
--text-base:  1rem       (16px) — Body
--text-lg:    1.25rem    (20px) — Lead copy
--text-xl:    1.5rem     (24px) — Sub-headline
--text-2xl:   2rem       (32px) — Section head
--text-3xl:   3.5rem     (56px) — Display
--text-mega:  clamp(5rem, 18vw, 14rem) — Poster fill type
```

### Type Rules
- **MEGA type:** ALL CAPS, Barlow Condensed 900, fills the full container width.
- **Sub-label:** Wide letter-spacing (0.3–0.5em), lightweight, sparse.
- **No serifs anywhere.** This is a sans-serif-only system.
- **No italic.** Oblique geometry only — no calligraphic forms.
- **Alignment:** Left-aligned or full-width stretched. Never centered.
- **Condensed numerals:** Line numbers rendered in Barlow Condensed.

---

## 04. SPACING SYSTEM

Base unit: **8px**

```
--space-1:   4px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-6:   24px
--space-8:   32px
--space-12:  48px
--space-16:  64px
--space-24:  96px
--space-32:  128px
```

**Layout Principle:** Grid-aligned geometric partitions. Color blocks divide space at precise column intervals. No organic spacing — all measurements are multiples of 8px.

---

## 05. GEOMETRY & STROKES

- **No border-radius.** `border-radius: 0` everywhere. Hard geometry.
- **No box-shadows.** Depth is created by overlapping flat color fields.
- **Curves as shapes:** Large sweeping curves are SVG paths or CSS clip-paths — organic motion encoded in pure geometry.
- **Stripe device:** 6–12px amber vertical or diagonal line running through train illustrations.
- **Window blocks:** Rounded-rectangle approximations (very slight radius, ~2px max) for train window cells only.
- **No decorative borders.** Color field edges ARE the borders.

### Geometric Form Library
```
Sweeping curve:   Large radius arc dividing two color fields (SVG path)
Train silhouette: Top-down rectangular form with window grid
Stripe:           6px amber line bisecting train body vertically
Color wedge:      Diagonal clip-path splitting canvas into color zones
```

---

## 06. LAYOUT SYSTEM

### Grid
- Mobile: 4-col, 0 gutter (color fields bleed edge-to-edge)
- Desktop: 12-col, 0 gutter (full-bleed geometric division)
- **No gutters between color zones.** Color fields meet at hard edges.

### Compositional Principles

1. **Field Division:** Canvas split into 2–4 large color zones by geometric curves or diagonal cuts.
2. **Top-Down Perspective:** Subject matter (trains) shown from aerial/plan view — abstract, diagrammatic.
3. **Bleed to edge:** All geometric forms run off canvas edges. Nothing floats inside a margin.
4. **Vertical rhythm via color:** Teal above, red below OR interlocked by curve. Never side-by-side with a gap.
5. **Type anchored to bottom:** Display type sits in the cream zone at the base, separated from illustration by a clean horizontal cut.

### Zone Types

| Zone | Color | Position | Purpose |
|---|---|---|---|
| `sky-zone` | Teal | Upper-left | Calm, directional |
| `motion-zone` | Transit Red | Upper-right / dominant | Energy, movement |
| `speed-stripe` | Amber | Diagonal across train | Velocity marker |
| `type-zone` | Canvas | Bottom 25% | All typographic content |
| `shadow-zone` | Night | Lower-left curve | Depth, grounding |

---

## 07. ICONOGRAPHY & MARKS

- **Metro M mark:** Circle with stylized M — bold, sans-serif, enclosed in circle
- **Transit icons:** Top-down silhouettes, geometric, single color
- **Line indicators:** Colored circles with condensed numerals
- **No illustrated icons.** Pure geometric symbols only.
- Logo placement: Bottom-right of type zone, small, non-competing.

---

## 08. MOTION (When Applied)

- **Primary metaphor:** Trains in motion — horizontal translate
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)` — material-motion standard
- Duration: `200ms` (micro) / `400ms` (standard) / `800ms` (cinematic train enter)
- Train entry: translate-X (-100% → 0) — entering from left
- Color zone transitions: clip-path animate on intersection reveal
- **No fade-in opacity reveals.** Geometric wipes or slides only.

---

## 09. FORBIDDEN PATTERNS

- ❌ Gradients of any kind
- ❌ Drop shadows or box shadows
- ❌ Border-radius > 2px (exception: train windows only)
- ❌ Serif typefaces
- ❌ Italic type
- ❌ Textures or grain
- ❌ Photography (system is illustration-only)
- ❌ More than 5 colors in any single composition
- ❌ Centered display type
- ❌ White backgrounds (canvas cream only)
- ❌ Decorative ornaments or flourishes
- ❌ Transparent/semi-transparent color overlays

---

## 10. COMPONENT PATTERNS

### Color Field Divider (Curve)
```
SVG path: large-radius cubic bezier
Fill: adjacent color (red or teal)
No stroke
Bleeds past canvas edge on both ends
```

### Train Silhouette (Top-Down)
```
Rectangle: --color-night, narrow aspect ratio
Window grid: evenly spaced rounded-rect cells in --color-canvas
Center stripe: 6px --color-amber vertical line
Optional red accent stripe: 2px beside amber
```

### Mega Type Lockup
```
Row 1: Small-caps sub-label, Barlow 500, 0.4em tracking, --color-night
Row 2: MEGA display, Barlow Condensed 900, full-width, --color-night
Row 3: Fine print, Barlow 400, centered, --color-night at 50% opacity
```

### Line Indicator Badge
```
Circle: 32–40px, filled with line color
Text: Barlow Condensed 700, white, centered numeral
No border-radius override — use perfect circle (border-radius: 50%)
```

---

*Constitution version 1.0 — Extracted May 2026*
