# Dark Theme Guide - ezyICT LMS

## Overview
Complete dark theme system using CSS variables for easy customization. Toggle between light and dark modes with a single click!

## How to Toggle Theme

### For Users
1. Look at the sidebar footer (when expanded)
2. Find the "Dark Mode" toggle switch
3. Click to switch between light and dark modes
4. Your preference is saved automatically

### For Developers
The theme is controlled by adding/removing the `dark` class on the `<html>` element:

```javascript
// Enable dark mode
document.documentElement.classList.add('dark');

// Disable dark mode
document.documentElement.classList.remove('dark');
```

## Customizing Colors

### Location
All theme colors are in: `client/src/app/globals.css`

### Light Mode Colors (Lines 48-70)
```css
:root {
  /* Main backgrounds */
  --theme-bg-primary: #ffffff;      /* White */
  --theme-bg-secondary: #f9fafb;    /* Very light gray */
  --theme-bg-tertiary: #f3f4f6;     /* Light gray */
  
  /* Text colors */
  --theme-text-primary: #111827;    /* Almost black */
  --theme-text-secondary: #6b7280;  /* Medium gray */
  --theme-text-tertiary: #9ca3af;   /* Light gray */
  
  /* Borders & shadows */
  --theme-border: #e5e7eb;          /* Light gray */
  --theme-shadow: rgba(0, 0, 0, 0.1);
  
  /* Sidebar */
  --sidebar-bg: #ffffff;
  --sidebar-text: #111827;
  --sidebar-hover: #f3f4f6;
  
  /* Sidebar icons */
  --sidebar-icon-dashboard: #000000;  /* Black */
  --sidebar-icon-videos: #000000;
  --sidebar-icon-papers: #000000;
  --sidebar-icon-students: #000000;
  --sidebar-icon-analytics: #000000;
  --sidebar-icon-settings: #000000;
}
```

### Dark Mode Colors (Lines 72-95)
```css
.dark {
  /* Main backgrounds */
  --theme-bg-primary: #0f172a;      /* Dark blue-gray */
  --theme-bg-secondary: #1e293b;    /* Medium dark */
  --theme-bg-tertiary: #334155;     /* Lighter dark */
  
  /* Text colors */
  --theme-text-primary: #f1f5f9;    /* Almost white */
  --theme-text-secondary: #cbd5e1;  /* Light gray */
  --theme-text-tertiary: #94a3b8;   /* Medium gray */
  
  /* Borders & shadows */
  --theme-border: #334155;          /* Dark gray */
  --theme-shadow: rgba(0, 0, 0, 0.3);
  
  /* Sidebar */
  --sidebar-bg: #1e293b;
  --sidebar-text: #f1f5f9;
  --sidebar-hover: #334155;
  
  /* Sidebar icons - White in dark mode */
  --sidebar-icon-dashboard: #ffffff;
  --sidebar-icon-videos: #ffffff;
  --sidebar-icon-papers: #ffffff;
  --sidebar-icon-students: #ffffff;
  --sidebar-icon-analytics: #ffffff;
  --sidebar-icon-settings: #ffffff;
}
```

## Using Theme Classes

### Background Colors
```tsx
<div className="theme-bg-primary">Main background</div>
<div className="theme-bg-secondary">Secondary background</div>
<div className="theme-bg-tertiary">Tertiary background</div>
```

### Text Colors
```tsx
<p className="theme-text-primary">Main text</p>
<p className="theme-text-secondary">Secondary text</p>
<p className="theme-text-tertiary">Tertiary text</p>
```

### Borders
```tsx
<div className="theme-border border">Themed border</div>
```

### Cards
```tsx
<div className="theme-card">
  Automatically themed card with background, border, and shadow
</div>
```

### Sidebar
```tsx
<aside className="sidebar-themed">
  Automatically themed sidebar
</aside>
```

## Quick Color Changes

### Change Dark Mode Background
```css
.dark {
  --theme-bg-primary: #your-color;  /* Change this */
}
```

### Change Dark Mode Text
```css
.dark {
  --theme-text-primary: #your-color;  /* Change this */
}
```

### Change Sidebar Color (Dark Mode)
```css
.dark {
  --sidebar-bg: #your-color;  /* Change this */
}
```

## Color Schemes

### Scheme 1: Blue Dark (Current)
```css
.dark {
  --theme-bg-primary: #0f172a;  /* Dark blue-gray */
  --theme-bg-secondary: #1e293b;
}
```

### Scheme 2: Pure Black (OLED)
```css
.dark {
  --theme-bg-primary: #000000;  /* Pure black */
  --theme-bg-secondary: #0a0a0a;
  --theme-bg-tertiary: #1a1a1a;
}
```

### Scheme 3: Warm Dark
```css
.dark {
  --theme-bg-primary: #1a1614;  /* Warm dark brown */
  --theme-bg-secondary: #2d2621;
  --theme-bg-tertiary: #3d342d;
}
```

### Scheme 4: Cool Gray
```css
.dark {
  --theme-bg-primary: #18181b;  /* Cool gray */
  --theme-bg-secondary: #27272a;
  --theme-bg-tertiary: #3f3f46;
}
```

## Components Using Theme

### Automatically Themed
- ✅ Sidebar (background, text, borders)
- ✅ Sidebar menu items
- ✅ Main layout background
- ✅ All text using theme classes
- ✅ Borders and shadows
- ✅ Cards and containers

### Manual Dark Mode Support
For components not using theme classes, add dark mode variants:

```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  Content
</div>
```

## Theme Toggle Component

**Location:** `client/src/components/ThemeToggle.tsx`

**Features:**
- Animated switch with icons
- Saves preference to localStorage
- Respects system preference
- Smooth transitions

**Usage:**
```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

<ThemeToggle />
```

## Testing Themes

### Test Light Mode
1. Click theme toggle to disable dark mode
2. Check all pages look correct
3. Verify text is readable
4. Check borders are visible

### Test Dark Mode
1. Click theme toggle to enable dark mode
2. Check all pages look correct
3. Verify text is readable (white on dark)
4. Check borders are visible
5. Verify icons are white

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Accessibility

- ✅ Respects `prefers-color-scheme` media query
- ✅ Saves user preference
- ✅ High contrast ratios
- ✅ Keyboard accessible toggle
- ✅ Focus indicators

## Tips

1. **Always use theme classes** for new components
2. **Test both themes** when adding new features
3. **Use CSS variables** instead of hardcoded colors
4. **Check contrast** - ensure text is readable
5. **Consistent spacing** - same in both themes

## Troubleshooting

### Theme not switching
- Check if `dark` class is added to `<html>`
- Clear browser cache
- Check localStorage for saved preference

### Colors look wrong
- Verify CSS variables are defined
- Check for hardcoded colors overriding theme
- Inspect element to see computed styles

### Icons not visible in dark mode
- Check `--sidebar-icon-*` variables in `.dark`
- Should be `#ffffff` (white) in dark mode

## Future Enhancements

- [ ] Multiple theme options (blue, purple, green)
- [ ] Custom color picker
- [ ] Per-user theme preferences (saved to backend)
- [ ] Automatic theme based on time of day
- [ ] Theme thumbnail before applying
