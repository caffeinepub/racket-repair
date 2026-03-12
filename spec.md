# RacketFix

## Current State
Dark athletic-themed site with electric lime accent. Nav has Share + Book Repair buttons. Admin page exists at /admin with its own login form. Home page uses charcoal background with oklch lime primary.

## Requested Changes (Diff)

### Add
- Admin Login button/link in the Nav bar that navigates to /admin
- Richer, more vibrant color scheme on the home page

### Modify
- Nav.tsx: add an "Admin Login" link/button (small, subtle, not competing with primary CTA) that goes to window.location.href = '/admin'
- index.css: upgrade color tokens to a more vivid, premium look — deep navy/dark-blue base with vibrant cyan-teal primary accent and warm amber secondary accent; keep dark theme but make it feel richer and more colorful

### Remove
- Nothing removed

## Implementation Plan
1. Update Nav.tsx to add Admin Login button (small ghost/outline style) beside Share button, navigates to /admin
2. Update index.css color tokens: richer dark base (deep navy), vibrant primary (cyan-teal), warm accent (amber/gold), updated gradients and glow utilities
3. Update Hero.tsx text-gradient-lime utility reference if color name changes
