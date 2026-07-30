---
name: UstadHub Premium
colors:
  surface: '#f9f9ff'
  surface-dim: '#d1daee'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dfe8fc'
  surface-container-highest: '#dae3f6'
  on-surface: '#131c2a'
  on-surface-variant: '#45464d'
  inverse-surface: '#28313f'
  inverse-on-surface: '#ebf1ff'
  outline: '#76767e'
  outline-variant: '#c6c6ce'
  surface-tint: '#565d79'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131a33'
  on-primary-container: '#7b83a0'
  inverse-primary: '#bec5e5'
  secondary: '#006a63'
  on-secondary: '#ffffff'
  secondary-container: '#99efe5'
  on-secondary-container: '#006f67'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271900'
  on-tertiary-container: '#a07f3c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#bec5e5'
  on-primary-fixed: '#131a33'
  on-primary-fixed-variant: '#3e4660'
  secondary-fixed: '#9cf2e8'
  secondary-fixed-dim: '#80d5cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#00504a'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#e9c178'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5d4202'
  background: '#f9f9ff'
  on-background: '#131c2a'
  surface-variant: '#dae3f6'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is engineered for a high-end global marketplace, prioritizing a sense of established authority and quiet luxury. The brand personality is professional, trustworthy, and sophisticated, avoiding the ephemeral trends of "hyper-growth" startups in favor of a timeless, refined SaaS aesthetic.

The visual style merges **Minimalism** with **Glassmorphism** and **Tactile** accents. It utilizes heavy whitespace to allow content to breathe, while employing multi-layered soft shadows to create a sense of physical depth. The emotional response should be one of security and exclusivity—positioning the platform not just as a tool, but as a premium service for elite users.

## Colors

The palette is anchored by **Midnight Navy**, providing a deep, authoritative foundation for structural elements like headers and sidebars. **Deep Emerald** serves as the functional accent, used sparingly for success states and verification to maintain a professional tone. 

**Champagne Gold** is the "signature" color, reserved strictly for premium indicators, thin borders, and high-value highlights. This is complemented by a **Warm Ivory** background which softens the interface compared to a clinical stark white, evoking the feel of high-quality stationery. In Dark Mode, the depth is maintained through desaturated tones of the primary palette to ensure accessibility and eye comfort without losing the luxury identity.

## Typography

This design system uses a dual-font strategy to balance character with utility. **Plus Jakarta Sans** is utilized for all headings and display text; its modern, geometric construction and slightly wider stance provide an approachable yet confident personality.

For body text and functional labels, **Inter** is the standard. Its high legibility and neutral tone ensure that long-form content and data-heavy interfaces remain clear and professional. Tracking (letter-spacing) is slightly tightened on large headings for a more "locked-in" editorial look, while small labels use increased tracking to maintain readability at diminished scales.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach for desktop to maintain the "contained" luxury feel, transitioning to a fluid model for mobile devices. A 12-column system is used for desktop (1280px max-width) with generous 24px gutters to prevent visual clutter.

Spacing follows an 8px linear scale. For high-level sections, the "stack-lg" (48px) spacing is preferred to create an open, airy atmosphere. Content should be grouped logically using "stack-sm" for related elements (label + input) and "stack-md" for unrelated blocks. On mobile, horizontal margins are reduced to 16px, and vertical spacing is scaled down by one step on the 8px grid to optimize screen real estate.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh, singular shadows in favor of multi-layered, low-opacity "diffused" shadows that mimic natural light.

1.  **Level 0 (Base):** Warm Ivory background.
2.  **Level 1 (Cards):** Pure White surface with a subtle 1px border (#E5E7EB) and a soft ambient shadow (0px 4px 20px rgba(0,0,0,0.04)).
3.  **Level 2 (Dropdowns/Modals):** Pure White surface with a more pronounced shadow (0px 12px 32px rgba(0,0,0,0.08)) and a subtle Backdrop Blur (8px) for glassmorphism effects on overlays.
4.  **Premium Accents:** Select Level 1 elements may feature a 1px Champagne Gold border to denote "Premium" or "Featured" status.

## Shapes

The shape language is defined by large, generous radii that evoke a modern, friendly, yet premium feel. While the system-wide roundedness is set to Level 2, specific components follow a strictly defined "Soft-Large" curvature:

-   **Cards and Containers:** Use a 20px or 24px radius to create a distinct, modern silhouette.
-   **Interactive Elements:** Buttons and Inputs use a slightly smaller 10px-12px radius to maintain a structural, functional appearance.
-   **Verification Badges:** Use full "Pill" rounding to contrast against the more geometric container shapes.

## Components

### Buttons
Primary buttons use the Midnight Navy background with white text. For premium actions, use a Champagne Gold border. Secondary buttons should be transparent with a Slate Gray border. Hover states should involve a subtle shift in background opacity rather than a color change.

### Cards
Cards are the primary organizational unit. They must have a 20px corner radius, a white background, and a soft ambient shadow. For "Verified" or "Premium" listings, a top-edge 2px border in Champagne Gold or Deep Emerald is used.

### Input Fields
Fields use a subtle Warm Ivory fill (slightly darker than the main background) to provide contrast against white cards. Borders are 1px Slate Gray at 20% opacity, turning Deep Emerald on focus.

### Chips & Badges
Badges use a desaturated version of the accent color (e.g., 10% opacity Deep Emerald) with full-color text. This "tonal" approach keeps the UI sophisticated and avoids the "loud" look of fully saturated blocks.

### Glassmorphism Elements
Sidebars and Top Navigation bars should employ a 12px backdrop blur with a 70% opacity Midnight Navy or White fill, creating a sense of layered transparency and technological sophistication.