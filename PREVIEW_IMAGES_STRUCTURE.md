# 🖼️ Preview Images - Consistent Folder Structure

## ✅ Folder Structure Created

All preview images are now organized in a consistent structure:

```
uploads/
├── videos/
│   ├── files/          ← Video files (.mp4, .mpeg, etc.)
│   └── images/         ← Preview/thumbnail images
├── papers/
│   ├── files/          ← PDF files
│   └── images/         ← Preview/thumbnail images
├── packages/
│   └── images/         ← Preview/background images
└── tutes/
    ├── files/          ← PDF/PPT files
    └── images/         ← Preview/thumbnail images
```

## 📁 Files Created/Updated

### Backend Configs
1. ✅ **server/src/config/videoUpload.ts** - NEW
   - Handles video files → `uploads/videos/files/`
   - Handles preview images → `uploads/videos/images/`
   - Max size: 500MB for videos, 5MB for images

2. ✅ **server/src/config/paperUpload.ts** - NEW
   - Handles PDF files → `uploads/papers/files/`
   - Handles preview images → `uploads/papers/images/`
   - Max size: 50MB for PDFs, 5MB for images

3. ✅ **server/src/config/packageImageUpload.ts** - UPDATED
   - Now saves to → `uploads/packages/images/`
   - Added file validation and size limits

4. ✅ **server/src/config/tuteUpload.ts** - ALREADY DONE
   - Handles files → `uploads/tutes/files/`
   - Handles preview images → `uploads/tutes/images/`

### Models Updated
1. ✅ **server/src/models/Video.ts**
   - Added `previewImage?: string` field

2. ✅ **server/src/models/Paper.ts**
   - Added `previewImageUrl?: string` field

3. ✅ **server/src/models/Tute.ts**
   - Already has `previewImageUrl?: string` field

4. ✅ **server/src/models/CoursePackage.ts**
   - Already has `backgroundImage?: string` field

## 🎨 Default Preview Images

When no preview image is uploaded, show a default placeholder:

### For Videos:
```tsx
{video.previewImage ? (
  <img src={`${API_BASE_URL}${video.previewImage}`} alt={video.title} />
) : (
  <div className="bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900">
    <Video icon />
  </div>
)}
```

### For Papers:
```tsx
{paper.previewImageUrl ? (
  <img src={`${API_BASE_URL}${paper.previewImageUrl}`} alt={paper.title} />
) : (
  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
    <FileText icon />
  </div>
)}
```

### For Tutes:
```tsx
{tute.previewImageUrl ? (
  <img src={`${API_BASE_URL}${tute.previewImageUrl}`} alt={tute.title} />
) : (
  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
    <BookOpen icon />
  </div>
)}
```

### For Packages:
```tsx
{pkg.backgroundImage ? (
  <img src={`${API_BASE_URL}${pkg.backgroundImage}`} alt={pkg.title} />
) : (
  <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
    <Package icon />
  </div>
)}
```

## 🔧 Next Steps

1. Update video controller to handle preview image upload
2. Update paper controller to handle preview image upload
3. Update video routes to accept multiple files
4. Update paper routes to accept multiple files
5. Update frontend pages to:
   - Add preview image upload field
   - Display preview images on cards
   - Show default placeholders when no image

## 📊 File Naming Convention

All files use consistent naming:
- Videos: `video-{timestamp}-{random}.ext`
- Papers: `file-{timestamp}-{random}.pdf`
- Tutes: `file-{timestamp}-{random}.ext`
- Preview Images: `previewImage-{timestamp}-{random}.ext`
- Package Images: `package-{timestamp}-{random}.ext`

---

**Status:** Backend Structure Complete ✅ | Controllers & Frontend Pending ⏳
