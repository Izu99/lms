# Reusable Modals Guide

## Overview
Created reusable modal components for Video and Paper creation that can be imported and used anywhere in the application.

## Available Modals

### 1. CreateVideoModal
Modal for uploading and creating new videos.

**Location:** `client/src/components/modals/CreateVideoModal.tsx`

**Usage:**
```tsx
import { CreateVideoModal } from "@/components/modals";

function YourComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Upload Video</button>
      
      <CreateVideoModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          // Called after successful video upload
          console.log("Video uploaded!");
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close
- `onSuccess?: () => void` - Optional callback after successful upload

**Features:**
- Full video upload form
- Institute and year selection
- File upload with validation
- Preview before submission
- Loading states

### 2. CreatePaperModal
Modal for creating new exam papers with quick start form.

**Location:** `client/src/components/modals/CreatePaperModal.tsx`

**Usage:**
```tsx
import { CreatePaperModal } from "@/components/modals";

function YourComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Create Paper</button>
      
      <CreatePaperModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Called when modal should close

**Features:**
- Quick start form (title, description, deadline, time limit)
- Saves draft to sessionStorage
- Redirects to full paper creation page
- Can skip quick form and go directly to creation page

**Behavior:**
- If user fills in title, saves draft and redirects
- If user clicks "Start Creating" without title, goes directly to creation page
- Draft data is loaded on the full creation page

## Import Both Modals

```tsx
import { CreateVideoModal, CreatePaperModal } from "@/components/modals";
```

## Where They're Used

### Teacher Dashboard
- **Location:** `client/src/modules/teacher/pages/Dashboard.tsx`
- **Buttons:** "Upload" (Videos section), "Create" (Papers section)
- Both modals integrated with dashboard data refresh

### Teacher Videos Page
- **Location:** `client/src/app/teacher/videos/page.tsx`
- **Button:** "Upload Video" in header
- Includes success callback to refresh video list

### Teacher Papers Page
- **Location:** `client/src/app/teacher/papers/page.tsx`
- **Button:** "Create Paper" in header
- Redirects to full creation page after quick form

## Styling

Both modals use:
- Consistent design with gradient headers
- Colorful icons matching the sidebar theme
- Backdrop blur effect
- Smooth animations
- Responsive layout
- Accessible close buttons

## Customization

### Change Modal Colors

**Video Modal (Green theme):**
```tsx
// In CreateVideoModal.tsx
className="bg-gradient-to-br from-green-400 to-green-600"
```

**Paper Modal (Orange theme):**
```tsx
// In CreatePaperModal.tsx
className="bg-gradient-to-br from-orange-400 to-orange-600"
```

### Add New Modal

1. Create new modal component in `client/src/components/modals/`
2. Export it from `client/src/components/modals/index.ts`
3. Import and use: `import { YourModal } from "@/components/modals"`

## Best Practices

1. **State Management:** Use local state for modal visibility
2. **Success Callbacks:** Refresh data after successful operations
3. **Error Handling:** Show user-friendly error messages
4. **Loading States:** Disable buttons during submission
5. **Validation:** Validate required fields before submission
6. **Cleanup:** Clear form data when modal closes

## Example: Full Implementation

```tsx
"use client";

import { useState } from "react";
import { CreateVideoModal, CreatePaperModal } from "@/components/modals";

export default function TeacherPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);

  const handleVideoSuccess = () => {
    // Refresh videos list
    console.log("Video created!");
    setIsVideoModalOpen(false);
  };

  return (
    <div>
      <button onClick={() => setIsVideoModalOpen(true)}>
        Upload Video
      </button>
      <button onClick={() => setIsPaperModalOpen(true)}>
        Create Paper
      </button>

      <CreateVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onSuccess={handleVideoSuccess}
      />

      <CreatePaperModal
        isOpen={isPaperModalOpen}
        onClose={() => setIsPaperModalOpen(false)}
      />
    </div>
  );
}
```

## Future Enhancements

- Add edit mode for existing videos/papers
- Add bulk upload for videos
- Add paper templates
- Add preview mode before submission
- Add auto-save for drafts
- Add keyboard shortcuts (Esc to close)
