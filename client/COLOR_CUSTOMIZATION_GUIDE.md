# ezyICT LMS - Color Customization Guide

## Overview
All colors are now centralized in `client/src/app/globals.css` using CSS variables. Change colors in ONE place and they update everywhere!

## Quick Color Change

### Change ALL Sidebar Icons to One Color
Open `client/src/app/globals.css` and find this section:

```css
/* Sidebar Menu Icon Colors - Change these to update all icons! */
--sidebar-icon-dashboard: #000000; /* Black */
--sidebar-icon-videos: #000000; /* Black */
--sidebar-icon-papers: #000000; /* Black */
--sidebar-icon-students: #000000; /* Black */
--sidebar-icon-analytics: #000000; /* Black */
--sidebar-icon-settings: #000000; /* Black */
--sidebar-icon-logout: #ef4444; /* Red for logout */
```

**Example: Change all to blue:**
```css
--sidebar-icon-dashboard: #2563eb;
--sidebar-icon-videos: #2563eb;
--sidebar-icon-papers: #2563eb;
--sidebar-icon-students: #2563eb;
--sidebar-icon-analytics: #2563eb;
--sidebar-icon-settings: #2563eb;
--sidebar-icon-logout: #ef4444; /* Keep logout red */
```

**Example: Use different colors for each:**
```css
--sidebar-icon-dashboard: #3b82f6; /* Blue */
--sidebar-icon-videos: #10b981; /* Green */
--sidebar-icon-papers: #f59e0b; /* Orange */
--sidebar-icon-students: #ec4899; /* Pink */
--sidebar-icon-analytics: #8b5cf6; /* Purple */
--sidebar-icon-settings: #eab308; /* Yellow */
--sidebar-icon-logout: #ef4444; /* Red */
```

## Brand Colors

### Primary Brand Color (ezyICT Blue)
```css
--brand-primary: #2563eb; /* Main blue from logo */
```

Used for:
- Logo background
- Active menu item background
- User profile avatar
- Primary buttons

**Change to your brand color:**
```css
--brand-primary: #your-color-here;
```

### Other Brand Colors
```css
--brand-primary-light: #93c5fd; /* Light blue */
--brand-primary-dark: #1e40af; /* Dark blue */
--brand-accent: #60a5fa; /* Accent blue */
```

## Active State Color

When a menu item is active (selected), it uses:
```css
--sidebar-icon-bg-active: var(--brand-primary);
```

To change active color independently:
```css
--sidebar-icon-bg-active: #your-active-color;
```

## Hover State Color

When hovering over menu items:
```css
--sidebar-icon-bg-hover: #f3f4f6; /* Light gray */
```

## Color Schemes

### Scheme 1: All Black Icons (Current)
```css
--sidebar-icon-dashboard: #000000;
--sidebar-icon-videos: #000000;
--sidebar-icon-papers: #000000;
--sidebar-icon-students: #000000;
--sidebar-icon-analytics: #000000;
--sidebar-icon-settings: #000000;
```

### Scheme 2: All Blue Icons
```css
--sidebar-icon-dashboard: #2563eb;
--sidebar-icon-videos: #2563eb;
--sidebar-icon-papers: #2563eb;
--sidebar-icon-students: #2563eb;
--sidebar-icon-analytics: #2563eb;
--sidebar-icon-settings: #2563eb;
```

### Scheme 3: Colorful Icons (Original)
```css
--sidebar-icon-dashboard: #06b6d4; /* Cyan */
--sidebar-icon-videos: #10b981; /* Green */
--sidebar-icon-papers: #f59e0b; /* Orange */
--sidebar-icon-students: #ec4899; /* Pink */
--sidebar-icon-analytics: #8b5cf6; /* Purple */
--sidebar-icon-settings: #eab308; /* Yellow */
```

### Scheme 4: Grayscale
```css
--sidebar-icon-dashboard: #1f2937; /* Dark gray */
--sidebar-icon-videos: #374151; /* Gray */
--sidebar-icon-papers: #4b5563; /* Medium gray */
--sidebar-icon-students: #6b7280; /* Light gray */
--sidebar-icon-analytics: #9ca3af; /* Lighter gray */
--sidebar-icon-settings: #d1d5db; /* Very light gray */
```

## Using Brand Colors in Components

### In Tailwind Classes
```tsx
<div className="bg-brand-primary">
  <p className="text-brand-primary">Text</p>
  <div className="border-brand-primary">Border</div>
</div>
```

### In Custom CSS
```css
.my-element {
  background-color: var(--brand-primary);
  color: var(--brand-accent);
}
```

## CSS Classes Available

### Sidebar Icon Classes
- `.sidebar-icon` - Base icon style
- `.sidebar-icon-collapsed` - Larger size when sidebar collapsed
- `.sidebar-icon-dashboard` - Dashboard icon color
- `.sidebar-icon-videos` - Videos icon color
- `.sidebar-icon-papers` - Papers icon color
- `.sidebar-icon-students` - Students icon color
- `.sidebar-icon-analytics` - Analytics icon color
- `.sidebar-icon-settings` - Settings icon color
- `.sidebar-icon-logout` - Logout icon color
- `.sidebar-icon-active` - Active state (uses brand primary)

### Brand Color Classes
- `.bg-brand-primary` - Primary background
- `.text-brand-primary` - Primary text
- `.border-brand-primary` - Primary border
- `.bg-brand-accent` - Accent background
- `.text-brand-accent` - Accent text

## File Locations

### Main Color Configuration
**File:** `client/src/app/globals.css`
**Lines:** 48-60 (CSS variables)
**Lines:** 130-200 (CSS classes)

### Sidebar Component
**File:** `client/src/components/teacher/TeacherSidebar.tsx`
**Lines:** 35-68 (menuItems array with colorClass)

## Testing Your Changes

1. Open `client/src/app/globals.css`
2. Change the color variables
3. Save the file
4. Refresh your browser
5. All icons update automatically!

## Tips

1. **Use hex colors** for simplicity: `#2563eb`
2. **Keep logout red** for safety (indicates destructive action)
3. **Test contrast** - ensure white icons are visible on your chosen colors
4. **Use brand colors** - match your company/school branding
5. **Consider accessibility** - maintain good color contrast ratios

## Common Color Palettes

### Professional Blue
```css
--brand-primary: #2563eb;
--sidebar-icon-dashboard: #1e40af;
--sidebar-icon-videos: #3b82f6;
--sidebar-icon-papers: #60a5fa;
```

### Modern Dark
```css
--brand-primary: #1f2937;
--sidebar-icon-dashboard: #111827;
--sidebar-icon-videos: #374151;
--sidebar-icon-papers: #4b5563;
```

### Vibrant
```css
--brand-primary: #8b5cf6;
--sidebar-icon-dashboard: #a78bfa;
--sidebar-icon-videos: #c084fc;
--sidebar-icon-papers: #e879f9;
```

## Need Help?

If icons don't change:
1. Clear browser cache (Ctrl+Shift+R)
2. Check CSS file saved correctly
3. Verify no syntax errors in CSS
4. Check browser console for errors

## Future Enhancements

- Dark mode support
- Theme switcher
- Per-user color preferences
- Seasonal themes
