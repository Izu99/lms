# 📝 Add Preview Image Upload to All Forms

## What to Add to Each Form

### 1. State Variable
```tsx
const [previewImage, setPreviewImage] = useState<File | null>(null);
```

### 2. Input Field (Add after main file upload)
```tsx
{/* Preview Image Upload */}
<div>
  <label className="block text-sm font-medium mb-2">
    Preview Image (Optional)
  </label>
  <div className="border-2 border-dashed rounded-lg p-4">
    {previewImage ? (
      <div className="space-y-2">
        <img 
          src={URL.createObjectURL(previewImage)} 
          alt="Preview" 
          className="w-full h-32 object-cover rounded"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setPreviewImage(null)}
        >
          Remove Image
        </Button>
      </div>
    ) : (
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setPreviewImage(e.target.files?.[0] || null)}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload a thumbnail/preview image
        </p>
      </div>
    )}
  </div>
</div>
```

### 3. Append to FormData (in handleSubmit)
```tsx
if (previewImage) {
  submitData.append('previewImage', previewImage);
}
```

## Files to Update

### Videos
- ✅ **client/src/components/VideoForm.tsx**
  - Add preview image state
  - Add preview image input field
  - Append to FormData

### Papers  
- ✅ **client/src/app/teacher/papers/create/page.tsx**
  - Add preview image state
  - Add preview image input field (after paper type selection)
  - Append to FormData

### Packages
- ✅ **client/src/app/teacher/course-packages/page.tsx** (if has create form)
  - OR find the package create modal/form
  - Add preview image upload

### Tutes
- ✅ **Already done!** ✓

## Display Preview Images on Cards

### Videos List Page
```tsx
{video.previewImage ? (
  <img 
    src={`${API_BASE_URL}${video.previewImage}`} 
    alt={video.title}
    className="w-full h-48 object-cover"
  />
) : (
  <div className="w-full h-48 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 flex items-center justify-center">
    <Video size={48} className="text-red-500" />
  </div>
)}
```

### Papers List Page
```tsx
{paper.previewImageUrl ? (
  <img 
    src={`${API_BASE_URL}${paper.previewImageUrl}`} 
    alt={paper.title}
    className="w-full h-48 object-cover"
  />
) : (
  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center">
    <FileText size={48} className="text-blue-500" />
  </div>
)}
```

---

**Next:** I'll update each form file to add these preview image upload fields.
