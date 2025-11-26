# 📚 Tutes (Tutorials) Feature - Implementation Guide

## Overview
New feature allowing teachers to upload PDF and PowerPoint files as tutorials, and students can view and download them.

## ✅ Backend Implementation (COMPLETED)

### 1. Database Model (`server/src/models/Tute.ts`)
```typescript
- title: string (required)
- description: string (optional)
- teacherId: ObjectId (required)
- fileUrl: string (required) - Path to PDF/PPT file
- fileType: 'pdf' | 'pptx' | 'ppt'
- availability: 'all' | 'physical'
- price: number (default: 0)
- institute: ObjectId (optional)
- timestamps: createdAt, updatedAt
```

### 2. File Upload Config (`server/src/config/tuteUpload.ts`)
- Accepts: PDF (.pdf), PowerPoint (.ppt, .pptx)
- Max file size: 50MB
- Upload directory: `uploads/tutes/`
- Unique filename generation with crypto

### 3. Controller (`server/src/controllers/tuteController.ts`)
**Teacher Endpoints:**
- `createTute` - Upload new tute
- `getTeacherTutes` - Get all tutes for logged-in teacher
- `getTuteById` - Get single tute details
- `updateTute` - Update tute (with optional file replacement)
- `deleteTute` - Delete tute and file

**Student Endpoints:**
- `getStudentTutes` - Get available tutes based on student type

### 4. Routes (`server/src/routes/tuteRoutes.ts`)
```
POST   /api/tutes              - Create tute (teacher)
GET    /api/tutes/teacher      - Get teacher's tutes
GET    /api/tutes/:id          - Get tute by ID
PUT    /api/tutes/:id          - Update tute (teacher)
DELETE /api/tutes/:id          - Delete tute (teacher)
GET    /api/tutes/student/all  - Get tutes for student
```

### 5. Server Integration (`server/src/index.ts`)
- ✅ Imported tuteRoutes
- ✅ Registered at `/api/tutes`

## 📁 Directory Structure Created

```
server/
├── src/
│   ├── models/
│   │   └── Tute.ts ✅
│   ├── controllers/
│   │   └── tuteController.ts ✅
│   ├── config/
│   │   └── tuteUpload.ts ✅
│   └── routes/
│       └── tuteRoutes.ts ✅
└── uploads/
    └── tutes/ (auto-created)
```

## 🎨 Frontend Implementation (TODO)

### Teacher Side
1. **Sidebar** - Add "Tutes" menu item
2. **Pages to create:**
   - `/teacher/tutes` - List all tutes (with CRUD actions)
   - `/teacher/tutes/create` - Create new tute
   - `/teacher/tutes/[id]/edit` - Edit existing tute

### Student Side
1. **Sidebar** - Add "Tutes" menu item
2. **Pages to create:**
   - `/student/tutes` - List available tutes
   - Download functionality for each tute

## 🔧 Next Steps

1. Create teacher tutes pages (list, create, edit)
2. Create student tutes page (view & download)
3. Add tutes to sidebar navigation
4. Test file upload/download functionality
5. Add proper error handling and loading states

## 🎯 Features

- ✅ PDF and PowerPoint support
- ✅ File size validation (50MB max)
- ✅ Unique filename generation
- ✅ Availability control (all/physical)
- ✅ Price support
- ✅ Full CRUD operations
- ✅ Student access control based on type
- ✅ File deletion on tute delete/update

---

**Status:** Backend Complete ✅ | Frontend Pending ⏳
