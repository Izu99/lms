# ID Card Image File Naming Strategy

## 🎯 New Approach: MongoDB ID-based Naming

### Benefits:
- ✅ **Permanent**: User ID never changes (unlike username)
- ✅ **Unique**: MongoDB IDs are guaranteed unique
- ✅ **Organized**: Easy to find images by user ID
- ✅ **Secure**: Harder to guess image paths
- ✅ **Future-proof**: Works even if user changes username

### File Naming Format:
```
uploads/id-cards/{mongodbId}.{extension}
```

### Examples:
```
Before (timestamp-based):
uploads/id-cards/1699123456789.jpg

After (ID-based):
uploads/id-cards/507f1f77bcf86cd799439011.jpg
uploads/id-cards/507f1f77bcf86cd799439012.png
uploads/id-cards/507f1f77bcf86cd799439013.jpeg
```

### Implementation Flow:
1. **Upload**: File initially saved with timestamp name
2. **User Creation**: User saved to database, gets MongoDB ID
3. **Rename**: File renamed from timestamp to MongoDB ID
4. **Update**: User record updated with new image path
5. **Cleanup**: On any error, temporary file is deleted

### Code Example:
```typescript
// User ID: 507f1f77bcf86cd799439011
// Original file: profile.jpg
// Final path: /uploads/id-cards/507f1f77bcf86cd799439011.jpg

const getUserIdCardPath = (userId: string, extension: string = 'jpg'): string => {
  return `/uploads/id-cards/${userId}.${extension}`;
};
```

This approach ensures clean, organized, and permanent file storage! 🚀