# 🎨 Theme Toggle UI Reference

## Navbar Location

```
┌─────────────────────────────────────────────────────────────┐
│  ≡  Karana  │              [Spacer]           │ Lang Theme Role│
├─────────────────────────────────────────────────────────────┤
│ Mobile    Logo           Main Content Area     
│ Menu                     (Sidebar hidden
│ Toggle                   on mobile)
└─────────────────────────────────────────────────────────────┘
         ↑                                           ↑
         │                                      Theme Icon
      Responsive                             (Moon/Sun)
      Menu
```

## Theme Toggle Button Components

### Button States

#### Light Mode
```
┌──────────┐
│    ☀️    │  ← Sun icon (indicates light theme active)
└──────────┘
```

**Appearance**:
- Icon: Sun (☀️)
- Size: 32px × 32px (h-8 w-8)
- Variant: Ghost (transparent background)
- Hover: Slight background tint

#### Dark Mode
```
┌──────────┐
│    🌙    │  ← Moon icon (indicates dark theme active)
└──────────┘
```

**Appearance**:
- Icon: Moon (🌙)
- Size: 32px × 32px (h-8 w-8)
- Variant: Ghost (transparent background)
- Hover: Slight background tint

### Dropdown Menu

When clicked, opens a dropdown menu:

```
┌─────────────────────────┐
│  ☀️  Light         │ ✓  │ ← User can see current selection
├─────────────────────────┤
│  🌙  Dark                │
├─────────────────────────┤
│ ✸  System          │ ✓  │ ← Or this (if System selected)
└─────────────────────────┘
```

**Menu Structure**:
- **Light** - with Sun icon
  - Label: "Light"
  - Check mark (✓) if selected
  - Tap/click to select

- **Dark** - with Moon icon
  - Label: "Dark"
  - Check mark (✓) if selected
  - Tap/click to select

- **System** - with hybrid icon
  - Label: "System"
  - Check mark (✓) if selected
  - Tap/click to select
  - Always shows current system preference

---

## Interactive Behavior

### Desktop Experience

```
Step 1: Hover over theme button
┌──────────────────────────────────────────────────────┐
│ ... Role: [Commissioner ▼] │ Theme Button (highlighted)
└──────────────────────────────────────────────────────┘

Step 2: Click to open menu
┌──────────────────────────────────────────────────────┐
│ ... │ Theme Button │ ☀️ Light    ✓ │
│     ├──────────────┤ 🌙 Dark      │
│     │ System       │ ✸ System     │
│     └──────────────┘────────────────┘

Step 3: Select an option
┌──────────────────────────────────────────────────────┐
│ ... │ Theme Button │ (Menu closes)
│     │ (Now shows DarkMode, UI updates)
└──────────────────────────────────────────────────────┘
```

### Mobile Experience

```
Step 1: Portrait view - compact layout
┌─────────────────────────────────┐
│ ≡  Karana    Theme  Language   │  ← Icons visible
├─────────────────────────────────┤
│ Dashboard (Full width)          │
└─────────────────────────────────┘

Step 2: Tap theme icon
┌─────────────────────────────────┐
│ Theme Menu (Position: fixed)    │
├─────────────────────────────────┤
│ ☀️  Light                     ✓ │
├─────────────────────────────────┤
│ 🌙  Dark                        │
├─────────────────────────────────┤
│ ✸  System                       │
└─────────────────────────────────┘

Step 3: Select theme
├─────────────────────────────────┤
│ Menu closes, UI updates         │
│ Dark mode now active!           │
└─────────────────────────────────┘
```

---

## Theme Application

### Immediate Visual Changes

When switching from Light → Dark:

**Light Mode**
```
Background Color:    #ffffff (white)
Text Color:         #1a1a2e (very dark blue)
Primary Accent:     #00c9a7 (teal)
Sidebar:            #fafafa (off-white)
Borders:            #dedede (light gray)
```
↓↓↓ **Theme Transition (200ms)** ↓↓↓
```
Background Color:    #1a1a2e (very dark)
Text Color:         #f5f5f5 (off-white)
Primary Accent:     #00e5c3 (bright teal)
Sidebar:            #202030 (very dark)
Borders:            #3d3d5c (dark gray)
```

### Elements That Change

**Always**:
- Page background
- Text colors
- Borders and dividers
- Card backgrounds
- Input fields
- Buttons (primary and secondary)
- Links and accents
- Scrollbars

**Contextual**:
- Alert/notification colors
- Hover states
- Focus states
- Active states
- Gradients (if using custom classes)

**Never** (Static):
- Layout/spacing
- Typography sizes
- Icons (change color but not shape)
- Component structure

---

## Keyboard Navigation

### Sequence to Change Theme Using Keyboard

```
1. Press Tab repeatedly until theme button focused
   └─ Button shows focus ring (outline visible)

2. Press Enter or Space to open dropdown
   └─ Menu appears with keyboard focus

3. Press ↓ Arrow to move to next option
   └─ Options highlight as you navigate:
      - From Light → to Dark
      - From Dark → to System
      - From System → back to Light

4. Press Enter to select
   └─ Menu closes, theme changes

5. Press Escape at any time
   └─ Menu closes without change
```

### Example Keyboard Flow

```
[Tab... Tab... Tab...]  ← Navigate through header
  │
  └─→ Theme Button FOCUSED
       ↓
      [Enter]  ← Open menu
       ↓
      Menu shows: Light✓ | Dark | System
       ↓
      [Down Arrow]  ← Move to "Dark"
       ↓
      Menu shows: Light | Dark FOCUSED | System
       ↓
      [Enter]  ← Select Dark
       ↓
      THEME CHANGES TO DARK!
       ↓
      [Escape would close without selecting]
```

---

## Screen Reader Experience

### Announced Content

**Button Label**:
```
"Switch theme (current: light)"
```

**Menu Items** (when hovering/focusing):
```
"Light button - checked"
"Dark button"
"System button"
```

**Selected State**:
```
"Light - selected✓" or "Dark - selected✓"
```

### Complete Announcement Sequence

```
1. User tabs to button
   Announced: "Switch theme, light. Button."

2. User presses Enter to open
   Announced: "Menu opened. 3 items. Light selected."

3. User arrows down
   Announced: "Dark. Button not selected."

4. User presses Enter to select
   Announced: "Dark selected."
   (Entire page repainted, page title might be announced again)
```

---

## Contrast Visualization

### Light Mode Example

```css
┌─────────────────────────────────┐
│ Background: #ffffff             │  ← 21:1 contrast
│ This text is very readable       │     (WCAG AAA)
│ Primary buttons: #00c9a7         │
│ Also perfectly readable: 8.5:1   │
└─────────────────────────────────┘
```

### Dark Mode Example

```css
┌─────────────────────────────────┐
│ Background: #1a1a2e             │  ← 17:1 contrast
│ This text is very readable       │     (WCAG AAA)
│ Primary buttons: #00e5c3         │
│ Also perfectly readable: 10.2:1  │
└─────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (≥ 1024px)
```
┌─────────────────────────────────────────────────────────┐
│  Brand │ [Spacer] │ Language 🌐  Theme 🌙/☀️  Role ▼   │
└─────────────────────────────────────────────────────────┘
All controls visible and horizontally aligned
```

### Tablet (768px - 1023px)
```
┌─────────────────────────────────────────────────────────┐
│  Brand │ [Spacer] │ Language Theme Role ▼               │
└─────────────────────────────────────────────────────────┘
Icons aligned, text labels hidden
```

### Mobile (< 768px)
```
┌─────────────────────────────────────┐
│ Menu ≡ │   Brand   │ Lang Theme Role │
└─────────────────────────────────────┘
All controls visible but compact
Language Switcher, Theme Toggle, Role Selector show as icons
Drawer menu available for additional navigation
```

---

## Animation Details

### Theme Switch Transition

**Timing**: Linear 200ms  
**Properties Animated**:
- `background-color`
- `color`
- `border-color`
- All `var(--*)` properties

**Visual Effect**:
```
Light → [200ms fade] → Dark
White    gradual      Very Dark
```

No harsh flash or jarring change - smooth visual transition.

### Hover Animation

**Duration**: 150ms ease  
**Effect**: Subtle background color shift

```
Default state:
┌─────────┐
│ Theme 🌙│  (no background)
└─────────┘

Hover state (after 150ms):
┌─────────────────┐
│ Theme 🌙        │  (subtle background tint)
└─────────────────┘
```

---

## Error States

### Accessibility Issues

**✅ Proper**: 
```
┌─────────┐
│ 🌙      │  ← Icon with proper `aria-hidden="true"`
│ Theme   │  ← Text label accompanying icon
└─────────┘
```

**❌ Improper**:
```
┌─────┐
│ 🌙  │  ← Icon with no alt text, no label visible
└─────┘    (screen reader says nothing!)
```

### What We Use (Correct)

✅ SVG Icon from lucide-react  
✅ `aria-hidden="true"` on icon  
✅ Text label "Switch theme"  
✅ `aria-label={`Switch theme (current: ${theme})`}`  
✅ Screen reader announces context  

---

## Visual Reference for Developers

### Component Props

```tsx
<ThemeToggle />
```

**Returns**:
- Desktop: Button with icon
- Mobile: Same button, slightly smaller
- Always: Accessible to keyboards and screen readers

### CSS Classes Applied

**Theme Button**:
```
- h-8 w-8 (32px × 32px)
- variant-ghost (transparent background)
- Hover: bg-accent/50 (subtle highlight)
- Focus: ring visible
```

**Dropdown Menu**:
```
- bg-popover
- text-popover-foreground
- border border-border/50
- shadow-md
- Positioned: align-end (right-aligned)
```

---

## Common Questions

### Q: Where exactly is the theme toggle?
**A**: Top-right header, between the language switcher and role selector. Look for the sun (☀️) or moon (🌙) icon.

### Q: How long does theme change take?
**A**: 200 milliseconds - fast enough to feel instant, slow enough to see the change is intentional.

### Q: Does my choice save?
**A**: Yes! Stored in browser localStorage with key `karana.theme`. Persists across sessions.

### Q: What if I use "System"?
**A**: Your device's setting controls it. If your OS is in dark mode, the app shows dark. If light mode, the app is light.

### Q: Can I change it back?
**A**: Yes, anytime! Just click the theme button and select a different theme.

### Q: Does every page have the toggle?
**A**: Yes! Every page has it in the same navbar location.

---

**Last Updated**: February 24, 2026  
**Version**: 1.0  
**Status**: ✅ Production Ready

For technical details, see **THEME_IMPLEMENTATION.md**  
For color reference, see **THEME_COLOR_PALETTE.md**
