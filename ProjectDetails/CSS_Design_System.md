# CSS Design System — AI Agent Reference

> **Purpose:** This document provides a complete reference of the CSS design system for AI agents to use when generating or modifying UI components. It covers all custom properties (tokens), component patterns, layout conventions, and usage rules.

---

## 1. Architecture Overview

### CSS Layers (defined in `main.css`)

```css
@layer tokens, base, layout, components, utilities, vendor;
```

| Layer | Contents | File(s) |
|-------|----------|---------|
| `tokens` | Design tokens (colors, spacing, typography, shadows) | `tokens/colors.css`, `tokens/variables.css` |
| `base` | Element resets and base styles | `base/reset.css`, `base/elements.css` |
| `layout` | Layout grids and page structure | *(not yet created)* |
| `components` | Reusable component styles | `components/components.css` (imports sub-files) |
| `utilities` | Utility/helper classes | `utilities/utilities.css` |
| `vendor` | Third-party overrides | *(not yet created)* |

### File Structure

```
public/css/
├── main.css                    # Entry point — imports everything with layer assignments
├── tokens/
│   ├── colors.css              # Color tokens (light/dark via light-dark())
│   ├── fonts.css               # @font-face declarations
│   └── variables.css           # Spacing, typography, shadows, glass effects
├── base/
│   ├── reset.css               # Box-sizing reset
│   └── elements.css            # Base HTML element styles (body, h1-h3, a, header, nav, main, footer)
├── components/
│   ├── components.css          # Component barrel file (imports sub-files)
│   ├── hero.css                # .hero section
│   ├── card.css                # .feature-card, .vehicle-card
│   ├── feature.css             # .features, .feature-grid
│   ├── theme-toggle.css        # Theme switcher <details>/<summary> component
│   ├── partials/
│   │   ├── header.css          # Header layout, nav.pages, nav.user, img.logo
│   │   └── footer.css          # Footer layout, .footer-nav
│   └── pages/
│       ├── home.css            # (empty — reserved)
│       ├── inventory.css       # .vehicle-grid, .vehicle-detail, .vehicle-gallery
│       └── login.css           # (empty — reserved)
└── utilities/
    └── utilities.css           # .visually-hidden
```

---

## 2. Design Tokens

### 2.1 Color System (`tokens/colors.css`)

All colors use the `light-dark()` CSS function for automatic light/dark mode support. The active color-scheme is controlled by a theme toggle component.

#### Seed Colors (Base Palette)

| Token | Light Value | Purpose |
|-------|-------------|---------|
| `--seed-bg` | `#f9fafb` | Page background |
| `--seed-surface` | `#ffffff` | Card/surface background |
| `--seed-text` | `#1f2937` | Primary text |
| `--seed-text-muted` | `#4b5563` | Muted/secondary text |
| `--seed-border` | `#e5e7eb` | Borders |
| `--seed-primary` | `#1e3a8a` | Primary brand (dark blue) |
| `--seed-accent` | `#f59e0b` | Accent (amber/gold) |
| `--seed-accent-hover` | `#d97706` | Accent hover state |
| `--seed-link` | `#1e3a8a` | Link color |
| `--seed-link-hover` | `#1d4ed8` | Link hover color |

#### Accent Scale (Generated via `color-mix`)

| Token | Derivation |
|-------|-----------|
| `--accent-200` | 30% accent + white |
| `--accent-300` | 50% accent + white |
| `--accent-400` | 75% accent + white |
| `--accent-500` | 100% accent (base) |
| `--accent-600` | 80% accent + black |
| `--accent-700` | 60% accent + black |
| `--accent-800` | 40% accent + black |

#### Semantic Color Tokens (light-dark aware)

| Token | Light | Dark |
|-------|-------|------|
| `--title-color` | `--seed-primary` | `oklch(0.92 0.02 240)` |
| `--bg-color` | `--seed-bg` | `oklch(0.14 0.01 240)` |
| `--surface-color` | `--seed-surface` | `oklch(0.20 0.01 240)` |
| `--text-color` | `--seed-text` | `oklch(0.95 0 0)` |
| `--text-muted` | `--seed-text-muted` | `oklch(0.74 0 0)` |
| `--primary-color` | `--seed-primary` | `oklch(0.55 0.18 245)` |
| `--accent-color` | `--seed-accent` | `oklch(0.79 0.16 75)` |
| `--link-color` | `--seed-link` | `oklch(0.70 0.14 240)` |
| `--link-hover-color` | `--seed-link-hover` | `oklch(0.80 0.12 235)` |
| `--border-color` | `--seed-border` | `oklch(0.28 0.01 240)` |

> **IMPORTANT:** Always use semantic tokens (`--text-color`, `--surface-color`, etc.) rather than raw hex values. This ensures dark mode compatibility.

### 2.2 Typography System (`tokens/variables.css` + `tokens/fonts.css`)

#### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-heading-custom` | `"Major Mono Display", monospace` | Headings |
| `--font-body-custom` | `"Lora", Georgia, serif` | Body text |
| `--font-family-heading` | `var(--font-heading-custom)` | Semantic alias |
| `--font-family-body` | `var(--font-body-custom)` | Semantic alias |

#### Font Sizes

| Token | Value (rem) | ~px |
|-------|-------------|-----|
| `--font-size-sm` | `0.875rem` | 14px |
| `--font-size-md` | `1rem` | 16px |
| `--font-size-lg` | `clamp(1.25rem, 1.14rem + 0.57vw, 1.5rem)` | 20-24px |
| `--font-size-xl` | `clamp(1.5rem, 1.27rem + 0.57vw, 2rem)` | 24-32px |
| `--font-size-hero` | `clamp(2.25rem, 1.95rem + 2.73vw, 3.7rem)` | 36-59px |

#### Semantic Font Size Aliases

| Token | Maps To |
|-------|---------|
| `--font-size-body` | `--font-size-md` |
| `--font-size-caption` | `--font-size-sm` |
| `--font-size-heading-sm` | `--font-size-lg` |
| `--font-size-heading-md` | `--font-size-xl` |
| `--font-size-display-sm` | `--font-size-hero` |

#### Font Weights

| Token | Value |
|-------|-------|
| `--font-light` | 300 |
| `--font-regular` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |

#### Line Heights

| Token | Value |
|-------|-------|
| `--line-height-body` | 1.6 |
| `--line-height-heading` | 1.25 |
| `--line-height-display` | 1.1 |

### 2.3 Spacing System (`tokens/variables.css`)

Based on an 8px unit multiplier with responsive `clamp()` for medium+ sizes.

| Token | Calculation | Value Range |
|-------|-------------|-------------|
| `--space-unit` | `8px` | 8px (base unit) |
| `--space-xs` | `calc(var(--space-unit) * 0.5)` | 4px |
| `--space-sm` | `var(--space-unit)` | 8px |
| `--space-md` | `clamp(1rem, 0.73rem + 1.36vw, 1.5rem)` | 16-24px |
| `--space-lg` | `clamp(1.5rem, 1.05rem + 2.27vw, 2.33rem)` | 24-37px |
| `--space-xl` | `clamp(2rem, 1.27rem + 3.64vw, 3.33rem)` | 32-53px |

#### Indentation Aliases

| Token | Maps To |
|-------|---------|
| `--indent-sm` | `--space-sm` |
| `--indent-md` | `--space-md` |
| `--indent-lg` | `--space-lg` |

### 2.4 Border Radii

| Token | Calculation | Value |
|-------|-------------|-------|
| `--radius-sm` | `calc(var(--space-unit) * 0.5)` | 4px |
| `--radius-md` | `var(--space-unit)` | 8px |
| `--radius-lg` | `calc(var(--space-unit) * 1.5)` | 12px |

### 2.5 Shadows & Elevation

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)` | `0 1px 2px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.25)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.12)` | `0 4px 6px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.45)` |
| `--text-shadow-hero` | `0 2px 4px rgba(0,0,0,0.4), 0 4px 12px rgba(0,0,0,0.3)` | (same — no light-dark) |

### 2.6 Glass/Surface Effects

| Token | Light | Dark |
|-------|-------|------|
| `--surface-glass` | `rgba(255, 255, 255, 0.45)` | `rgba(30, 30, 30, 0.65)` |
| `--border-glass` | `rgba(255, 255, 255, 0.4)` | `rgba(255, 255, 255, 0.1)` |

### 2.7 Motion & Interaction

| Token | Value |
|-------|-------|
| `--transition-base` | `0.2s ease` |
| `--outline-width` | `2px` |
| `--icon-size-sm` | `24px` |
| `--icon-size-md` | `32px` |

---

## 3. Component Patterns

### 3.1 Hero Section (`.hero`)

```css
.hero {
    padding: var(--space-xl) var(--space-lg);
    text-align: center;
    background: var(--surface-glass);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border-glass);
}
```

- Contains a heading (`h1`), optional paragraph (`max-width: 46ch`), and CTA link
- CTA link uses `--primary-color` background, switches to `--accent-color` on hover with `translateY(-2px)`

### 3.2 Feature Card (`.feature-card`)

```css
.feature-card {
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
}
```

- Hover: `translateY(-4px)`, `--shadow-md`, border blends with `--primary-color`
- Used inside `.feature-grid` (auto-fill grid with `minmax(280px, 1fr)`)

### 3.3 Vehicle Card (`.vehicle-card`)

```css
.vehicle-card {
    background-color: var(--surface-color);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
}
```

- Contains `.vehicle-card-image` (200px height, overflow hidden) and `.vehicle-card-body` (padding, flex column)
- Image zooms on hover (`scale(1.05)`)
- `.vehicle-price` — bold, `--primary-color`
- `.vehicle-status.available` / `.vehicle-status.unavailable` — status badges
- `.btn` inside card — `--primary-color` background, white text

### 3.4 Vehicle Grid (`.vehicle-grid`)

```css
.vehicle-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-xl);
}
```

- Responsive: 4 cols → 2 cols at 1024px → 1 col at 640px

### 3.5 Vehicle Detail Page (`.vehicle-detail`)

```css
.vehicle-detail {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
}
```

- Contains `.vehicle-gallery` (main image + thumbnails) and `.vehicle-info`
- Thumbnails: 80x60px, border highlights on hover

### 3.6 Theme Toggle (`.theme-switcher`)

- Uses `<details>`/`<summary>` pattern with hidden radio inputs
- Three options: Light (`☀️ Light`), Dark (`🌖 Dark`), System (`⚙️ System`)
- Controlled via `input[name="theme-preference"]` with values `light`, `dark`, `system`
- Active option highlighted with `--border-color` background and `--accent-color` text
- Dropdown panel: absolute positioned, `--surface-color` background, shadow

### 3.7 Header

- Flexbox layout: `justify-content: space-between`, `align-items: center`
- `nav.pages` and `nav.user` — flex containers with `gap: var(--space-md)`
- Logo (`img.logo`): `height: clamp(32px, 4vh, 48px)`, scales on hover
- Desktop (1024px+): larger font sizes, 56px logo, increased gaps

### 3.8 Footer

- Mobile: stacked column layout
- Desktop (768px+): row layout with `justify-content: space-between`
- `.footer-nav` — flex row of links
- Copyright text: `--font-size-caption`, `--text-muted`

---

## 4. Base Element Styles

| Element | Key Properties |
|---------|---------------|
| `body` | `--font-family-body`, `--font-size-body`, `--line-height-body`, `--text-color`, `--bg-color`, flex column, min-height 100vh |
| `h1` | `--font-family-heading`, `--font-size-display-sm`, `--font-bold`, `--text-shadow-hero` |
| `h2` | `--font-family-heading`, `--font-size-heading-md`, `--font-semibold`, centered |
| `h3` | `--font-family-heading`, `--font-size-heading-sm`, `--font-medium` |
| `a` | `--link-color`, `transition: color/background/transform 0.2s ease` |
| `header` | `--surface-color`, `--border-color` bottom border, flexbox |
| `nav` | flex, `gap: var(--space-lg)`, `text-indent: var(--indent-sm)` |
| `main` | `flex-grow: 1` |
| `footer` | `--surface-color`, top border, `margin-top: auto` (sticky footer) |

---

## 5. Utility Classes

| Class | Purpose |
|-------|---------|
| `.visually-hidden` | Screen-reader-only accessible hiding |

---

## 6. Theme System Rules

### How It Works

1. The `color-scheme` property on `:root` is set to `light` by default
2. A `<details>` theme switcher contains radio inputs with name `theme-preference`
3. When `dark` is checked: `html:has(input[name="theme-preference"][value="dark"]:checked)` sets `color-scheme: dark`
4. When `system` is checked: respects `prefers-color-scheme` media query
5. The `light-dark()` CSS function automatically swaps colors based on the active `color-scheme`

### Required HTML Structure

```html
<details class="theme-switcher">
    <summary class="theme-control">Toggle Theme</summary>
    <div class="theme-extra">
        <label class="theme-label">
            <input type="radio" name="theme-preference" value="light" checked>
            <span>☀️ Light</span>
        </label>
        <label class="theme-label">
            <input type="radio" name="theme-preference" value="dark">
            <span>🌖 Dark</span>
        </label>
        <label class="theme-label">
            <input type="radio" name="theme-preference" value="system">
            <span>⚙️ System</span>
        </label>
    </div>
</details>
```

---

## 7. Rules for AI Agents

### DO:
- ✅ Use semantic tokens (`--text-color`, `--surface-color`, `--space-md`, etc.) instead of hardcoded values
- ✅ Use `light-dark()` for any new color tokens to maintain theme compatibility
- ✅ Use `clamp()` for responsive sizing (especially spacing `--space-md` through `--space-xl`)
- ✅ Add new component CSS files in `components/` and import them via `components/components.css`
- ✅ Add new page-specific CSS in `components/pages/` and import via `components/components.css`
- ✅ Use `@layer` when adding new imports to `main.css`
- ✅ Follow the existing BEM-like naming: `.component-name`, `.component-child`, `.component-child--modifier`

### DON'T:
- ❌ Do not use raw hex colors — always reference a token
- ❌ Do not add `!important` unless absolutely necessary for theme toggle overrides
- ❌ Do not create new CSS files outside the established directory structure
- ❌ Do not modify `tokens/` files without updating this document
- ❌ Do not use `prefers-color-scheme` directly in component styles — rely on `light-dark()` and the theme toggle system instead

### When Adding a New Component:
1. Create the CSS file in the appropriate `components/` subdirectory
2. Import it in `components/components.css` (or directly in `main.css` for new layers)
3. Use only token variables for colors, spacing, typography, and shadows
4. Test in both light and dark modes
5. Add responsive behavior using the existing breakpoint conventions

### Breakpoint Conventions:
- Mobile-first (base styles are mobile)
- `@media (min-width: 768px)` — tablet
- `@media (min-width: 1024px)` — desktop
- `@media (max-width: ...)` — used sparingly for grid column reductions

---

## 8. Quick Reference: Most Commonly Used Tokens

```css
/* Colors */
color: var(--text-color);
color: var(--text-muted);
background-color: var(--surface-color);
background-color: var(--bg-color);
border-color: var(--border-color);
color: var(--primary-color);
color: var(--accent-color);
color: var(--link-color);

/* Spacing */
padding: var(--space-sm) var(--space-md);
margin-bottom: var(--space-lg);
gap: var(--space-md);

/* Typography */
font-family: var(--font-family-body);
font-family: var(--font-family-heading);
font-size: var(--font-size-body);
font-weight: var(--font-medium);

/* Effects */
border-radius: var(--radius-md);
box-shadow: var(--shadow-sm);
transition: all var(--transition-base);
```

---

*Last updated: 2026-07-11*