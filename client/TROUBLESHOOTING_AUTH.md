# Authentication Troubleshooting Guide

## Issue: "Unauthorized" when logging in as teacher

### Debug Steps

1. **Visit the Debug Page**
   - Go to: `http://localhost:3000/debug-auth`
   - This page shows:
     - Current auth state from useAuth hook
     - LocalStorage data
     - Role information
     - Quick action buttons

2. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for console logs:
     - "Login successful - User data:" (from login page)
     - "useAuth - Initializing:" (from useAuth hook)
     - "useAuth - Parsed user data:" (from useAuth hook)
     - "TeacherLayout - Auth State:" (from TeacherLayout)

3. **Verify User Data Structure**
   The user object should look like:
   ```json
   {
     "id": "507f1f77bcf86cd799439011",
     "username": "teacher1",
     "role": "teacher",
     "firstName": "John",
     "lastName": "Doe"
   }
   ```

### Common Issues & Solutions

#### Issue 1: Role is not "teacher"
**Symptom:** User role shows as "student" or undefined
**Solution:** 
- Check the database - ensure the user's role field is set to "teacher"
- In MongoDB:
  ```javascript
  db.users.updateOne(
    { username: "your_username" },
    { $set: { role: "teacher" } }
  )
  ```

#### Issue 2: User data not in localStorage
**Symptom:** localStorage shows null or empty user data
**Solution:**
- Clear browser cache and localStorage
- Log out and log in again
- Check if login API is returning correct data

#### Issue 3: Token expired or invalid
**Symptom:** Has token but still redirected
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Log in again to get fresh token

#### Issue 4: Role check failing
**Symptom:** Console shows role is "teacher" but still unauthorized
**Solution:**
- Check for typos in role string (case-sensitive)
- Verify TeacherLayout is checking `user.role === "teacher"` correctly
- Check if there are multiple auth checks conflicting

### Manual Testing

1. **Test Login Flow:**
   ```
   1. Go to /login
   2. Enter teacher credentials
   3. Check console for "Login successful - User data:"
   4. Should redirect to /teacher/dashboard
   ```

2. **Test Direct Access:**
   ```
   1. After logging in, go to /debug-auth
   2. Verify role shows "teacher"
   3. Click "Go to Teacher Dashboard"
   4. Should see sidebar and dashboard
   ```

3. **Test Sidebar:**
   ```
   1. On teacher dashboard, sidebar should show
   2. Click toggle button to collapse/expand
   3. Navigate to different sections
   4. All should work without unauthorized errors
   ```

### Backend Verification

Check the login endpoint response:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"teacher_username","password":"password"}'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "role": "teacher",
  "username": "teacher1",
  "id": "507f1f77bcf86cd799439011",
  "firstName": "John",
  "lastName": "Doe",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "teacher1",
    "role": "teacher",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Files Modified for Auth

1. **client/src/components/teacher/TeacherLayout.tsx**
   - Fixed: `loading` → `isLoading`
   - Added: Console logging for debugging
   - Added: Better role checking

2. **client/src/app/(auth)/login/page.tsx**
   - Added: Console logging after successful login
   - Added: Fallback for user data structure

3. **client/src/modules/shared/hooks/useAuth.ts**
   - Added: Console logging for initialization
   - Shows: Token and user data status

### Quick Fix Commands

```bash
# Clear all localStorage (in browser console)
localStorage.clear()

# Check current user data (in browser console)
console.log(JSON.parse(localStorage.getItem('user')))

# Check token (in browser console)
console.log(localStorage.getItem('token'))
```

### Contact Points

If issue persists:
1. Check all console logs in browser
2. Visit /debug-auth page
3. Verify database user role
4. Check backend API response
5. Clear cache and try fresh login
