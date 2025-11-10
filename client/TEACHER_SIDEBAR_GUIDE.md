# Teacher Sidebar Navigation

## Overview
Modern collapsible sidebar navigation for the teacher portal with colorful icons and smooth animations.

## Features
- **Collapsible Design**: Toggle between full sidebar (72px) and icon-only mode (20px)
- **Colorful Icons**: Each section has a unique gradient color for easy identification
- **Smooth Animations**: 300ms transitions for all state changes
- **Tooltips**: Hover tooltips appear when sidebar is collapsed
- **Responsive**: Works seamlessly on all screen sizes
- **Modern UI**: Gradient backgrounds, shadows, and rounded corners

## Navigation Structure

### Main Routes
- **Dashboard** (`/teacher`) - Cyan icon - Overview and stats
- **Videos** (`/teacher/videos`) - Green icon - Video management
- **Papers** (`/teacher/papers`) - Orange icon - Exam papers
- **Students** (`/teacher/students`) - Pink icon - Student management
- **Analytics** (`/teacher/analytics`) - Purple icon - Performance metrics
- **Settings** (`/teacher/settings`) - Yellow icon - Account settings

## Usage

### Wrapping Pages
All teacher pages should be wrapped with `TeacherLayout`:

```tsx
import { TeacherLayout } from "@/components/teacher/TeacherLayout";

export default function YourPage() {
  return (
    <TeacherLayout>
      {/* Your content here */}
    </TeacherLayout>
  );
}
```

### Toggle Sidebar
Click the chevron button in the sidebar header to collapse/expand.

## Components

### Core Components
- `sidebar.tsx` - Base sidebar primitives
- `TeacherSidebar.tsx` - Teacher-specific sidebar with navigation
- `TeacherLayout.tsx` - Layout wrapper with auth and sidebar

### Styling
- Uses Tailwind CSS with custom gradients
- Consistent spacing and shadows
- Hover effects on all interactive elements

## Security
- Automatic role-based access control
- Redirects non-teachers to `/unauthorized`
- Protected routes with auth checks

## Future Enhancements
- Add notification badges
- Implement keyboard shortcuts
- Add search functionality
- Theme customization options
