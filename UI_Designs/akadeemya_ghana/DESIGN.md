# Design System Specification: Institutional Integrity & Blockchain Veracity

## 1. Overview & Creative North Star: "The Digital Ledger"
The creative direction for this design system is **The Digital Ledger**. In the context of academic verification in Ghana, the UI must transcend "standard web app" aesthetics to feel like a sovereign, high-security institution. 

To achieve this, we move away from the "boxy" bootstrap look in favor of an **Editorial Blockchain** aesthetic. We utilize intentional asymmetry, high-contrast typography, and layered depth to suggest a system that is both immutable and transparent. By treating the screen as a series of sophisticated, physical layers rather than a flat grid, we evoke the prestige of a traditional university parchment translated into a modern, cryptographic future.

---

## 2. Colors & Surface Philosophy
The palette is rooted in authority (`primary`) and excellence (`secondary`), balanced by a breathable, high-end neutral base.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts.
- Use `surface-container-low` (#f2f4f7) for the main canvas.
- Use `surface-container-lowest` (#ffffff) for primary content cards.
- This creates a sophisticated, "borderless" interface where the eye follows tonal transitions rather than harsh lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked architectural planes:
1.  **Base Layer:** `background` (#f7f9fc)
2.  **Structural Sidebar/Header:** `primary_container` (#0f1c2c) — provides a heavy, institutional anchor.
3.  **Content Zones:** `surface_container_low` (#f2f4f7)
4.  **Actionable Elements/Cards:** `surface_container_lowest` (#ffffff)

### The Glass & Gradient Rule
To prevent the deep navy from feeling "flat," use **Signature Textures**. Main CTAs or high-level verification summaries should utilize a subtle linear gradient from `primary` (#000000/Deep Navy) to `primary_container` (#0f1c2c) at a 135-degree angle. Floating verification modals should utilize **Glassmorphism**:
- **Fill:** `surface_variant` (#e0e3e6) at 70% opacity.
- **Effect:** 20px Backdrop Blur.
- This suggests "transparency" — a core tenant of blockchain technology.

---

## 3. Typography: Editorial Authority
We use a dual-typeface system to balance modern tech with institutional weight.

| Level | Token | Font | Size | Weight | Intent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Manrope | 3.5rem | 700 | Hero verification counts |
| **Headline** | `headline-md` | Manrope | 1.75rem | 600 | Page titles / Section headers |
| **Title** | `title-lg` | Inter | 1.375rem | 600 | Card titles / Modal headers |
| **Body** | `body-md` | Inter | 0.875rem | 400 | General metadata / Data tables |
| **Label** | `label-md` | Inter | 0.75rem | 500 | Form labels / Status tags |

**Usage Note:** Manrope (Display/Headline) provides a geometric, modern precision, while Inter (Body/Labels) ensures maximum legibility for complex cryptographic hashes and academic records.

---

## 4. Elevation & Depth: Tonal Layering
Traditional box-shadows are often clumsy. In this system, we use **Ambient Light** principles.

- **The Layering Principle:** Instead of shadows, place a `surface-container-lowest` card on a `surface-container-low` background. The subtle shift from #f2f4f7 to #ffffff is enough to signify a "lift."
- **Ambient Shadows:** For floating elements (like a "Verified" badge), use an extra-diffused shadow: `box-shadow: 0 12px 40px rgba(13, 27, 42, 0.06)`. Note the 6% opacity; it should feel like a whisper, not a smudge.
- **The "Ghost Border" Fallback:** If a border is required for high-contrast accessibility in forms, use `outline_variant` at 20% opacity. Never use 100% black or grey borders.

---

## 5. Components: Precision Primitives

### Buttons (The "Seal of Excellence")
- **Primary:** Filled with `secondary` (#755b00/Gold). Text: `on_secondary` (#ffffff).
- **Secondary:** Outlined using the Ghost Border rule (20% `outline`).
- **Interaction:** On hover, primary buttons should scale 2% (`scale: 1.02`) and transition to `on_secondary_fixed_variant` to simulate a "pressing" into the page.

### Cards & Lists (The "Immutable Record")
- **Radius:** All cards must use `lg` (0.5rem / 8px) roundedness.
- **Spacing:** Forbid divider lines. Use `spacing.6` (2rem) of vertical whitespace to separate certificate entries.
- **Table Structure:** Eschew standard borders. Use alternating rows: Row A (`surface_container_lowest`) and Row B (`primary_fixed` at 10% opacity).

### Input Fields (The "Secure Entry")
- **State:** Inactive fields use `surface_container_highest`. 
- **Focus State:** Instead of a simple color change, use a 2px outer glow of `surface_tint` (#525f71) to indicate active cryptographic "focus."
- **Validation:** Error states use `error` (#ba1a1a) text with a `error_container` tint behind the input box.

### Signature Component: The "Verification Pulse"
For certificate verification statuses, use a **Status Chip**:
- **Valid:** `on_tertiary_fixed_variant` (Greenish tint) with a 4px breathing glow animation.
- **Invalid:** `on_error_container` (Deep Red) with a static, heavy weight.

---

## 6. Do's and Don'ts

### Do:
- **Use Wide Gutters:** Use `spacing.16` (5.5rem) for page margins to allow the institutional content to breathe.
- **Tone-on-Tone:** Use `on_surface_variant` for secondary text to maintain a soft hierarchy against the primary navy.
- **Asymmetric Layouts:** Place a large `display-md` headline on the left with a significantly smaller `body-md` explanatory paragraph offset to the right.

### Don't:
- **No Divider Lines:** Never use a `<hr>` or a 1px border to separate list items. Use whitespace or a background shift.
- **No Generic Icons:** Avoid "bubbly" or "playful" icons. Use thin-stroke (1.5pt), sharp-cornered iconography to maintain the serious, institutional tone.
- **No Pure Black:** Never use #000000 for text. Use `on_background` (#191c1e) to ensure the contrast is high but the "vibe" is premium.