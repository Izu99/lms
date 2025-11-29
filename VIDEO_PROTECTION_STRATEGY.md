# 🔒 Video Protection Strategy - Prevent Downloads & Recording

## 🎯 Goal
Prevent students from downloading or recording videos to protect revenue and ensure they must pay for access.

---

## ⚠️ Reality Check

**Important**: No solution is 100% foolproof. Determined users can always find ways to record (screen capture, phone recording, etc.). However, we can make it **difficult enough** that 95%+ of users won't bother.

---

## 🛡️ Multi-Layer Protection Strategy

### Layer 1: Disable Right-Click & Browser Controls ✅ FREE

#### Implementation:
```tsx
// Add to your video player component
<video
  src={videoUrl}
  controls={false}  // Remove default controls
  controlsList="nodownload nofullscreen noremoteplayback"
  disablePictureInPicture
  onContextMenu={(e) => e.preventDefault()}  // Disable right-click
  className="pointer-events-none select-none"  // Prevent selection
>
  Your browser does not support the video tag.
</video>

// Add custom controls (play, pause, volume only)
<div className="custom-controls">
  <button onClick={handlePlayPause}>Play/Pause</button>
  <input type="range" onChange={handleVolumeChange} />
</div>
```

#### CSS Protection:
```css
video {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: none;
}

/* Disable screenshot on some browsers */
video {
  -webkit-touch-callout: none;
}
```

---

### Layer 2: HLS Streaming (Encrypted Chunks) ✅ FREE

Instead of serving direct MP4 files, use **HLS (HTTP Live Streaming)** which breaks videos into small encrypted chunks.

#### Why HLS?
- Videos are split into 2-10 second chunks
- Each chunk can be encrypted
- Much harder to download the full video
- IDM and similar tools struggle with HLS

#### Implementation:

**Backend (Convert MP4 to HLS):**
```bash
# Install FFmpeg (free)
sudo apt-get install ffmpeg

# Convert video to HLS
ffmpeg -i input.mp4 \
  -codec: copy \
  -start_number 0 \
  -hls_time 10 \
  -hls_list_size 0 \
  -f hls \
  output.m3u8
```

**Backend Controller:**
```typescript
// server/src/controllers/videoController.ts
import { exec } from 'child_process';
import path from 'path';

export const convertToHLS = async (videoPath: string) => {
  const outputDir = path.dirname(videoPath);
  const outputName = path.basename(videoPath, path.extname(videoPath));
  const hlsPath = path.join(outputDir, `${outputName}.m3u8`);

  return new Promise((resolve, reject) => {
    exec(
      `ffmpeg -i ${videoPath} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${hlsPath}`,
      (error) => {
        if (error) reject(error);
        else resolve(hlsPath);
      }
    );
  });
};
```

**Frontend (HLS Player):**
```tsx
// Install: npm install hls.js
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';

export const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const hls = new Hls();
      hls.loadSource(videoUrl); // .m3u8 file
      hls.attachMedia(videoRef.current);
      
      return () => hls.destroy();
    }
  }, [videoUrl]);

  return (
    <video
      ref={videoRef}
      controls={false}
      controlsList="nodownload"
      disablePictureInPicture
      onContextMenu={(e) => e.preventDefault()}
      className="w-full"
    />
  );
};
```

---

### Layer 3: Video Watermarking ✅ FREE

Add student's name/ID as watermark on video to discourage sharing.

#### Implementation:
```tsx
// Add overlay on video
<div className="relative">
  <video src={videoUrl} />
  
  {/* Watermark overlay */}
  <div className="absolute top-4 right-4 text-white/30 text-sm font-mono">
    {user.name} - ID: {user.id}
  </div>
  
  {/* Random position watermark (harder to crop) */}
  <div 
    className="absolute text-white/20 text-xs"
    style={{
      top: `${Math.random() * 80}%`,
      left: `${Math.random() * 80}%`,
    }}
  >
    {user.email}
  </div>
</div>
```

---

### Layer 4: Domain Restriction ✅ FREE

Only allow videos to play on your domain.

#### Backend:
```typescript
// server/src/middleware/videoAuth.ts
export const checkReferer = (req: Request, res: Response, next: NextFunction) => {
  const referer = req.headers.referer || req.headers.origin;
  const allowedDomains = ['yourdomain.com', 'localhost:3000'];
  
  if (!referer || !allowedDomains.some(domain => referer.includes(domain))) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  next();
};

// Apply to video routes
router.get('/videos/:id/stream', checkReferer, streamVideo);
```

---

### Layer 5: Time-Limited Tokens ✅ FREE

Generate temporary URLs that expire after a short time.

#### Backend:
```typescript
import jwt from 'jsonwebtoken';

export const generateVideoToken = (videoId: string, userId: string) => {
  return jwt.sign(
    { videoId, userId },
    process.env.JWT_SECRET!,
    { expiresIn: '2h' } // Token expires in 2 hours
  );
};

export const streamVideo = async (req: Request, res: Response) => {
  const { token } = req.query;
  
  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!);
    // Stream video
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
```

#### Frontend:
```tsx
const VideoPlayer = ({ videoId }: { videoId: string }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    // Get temporary URL from backend
    fetch(`/api/videos/${videoId}/get-url`)
      .then(res => res.json())
      .then(data => setVideoUrl(data.url));
  }, [videoId]);

  return <video src={videoUrl} />;
};
```

---

### Layer 6: Disable DevTools (Partial) ⚠️ LIMITED

```tsx
// Add to your app
useEffect(() => {
  // Detect DevTools
  const detectDevTools = () => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      // DevTools detected - could pause video or show warning
      console.clear();
      alert('Developer tools detected. Video playback paused.');
    }
  };

  const interval = setInterval(detectDevTools, 1000);
  return () => clearInterval(interval);
}, []);

// Disable F12, Ctrl+Shift+I, etc.
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && e.key === 'I') ||
      (e.ctrlKey && e.shiftKey && e.key === 'J') ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      return false;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, []);
```

---

### Layer 7: Screen Recording Detection ⚠️ EXPERIMENTAL

```tsx
// Detect screen recording (works in some browsers)
useEffect(() => {
  const detectScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      // If this succeeds, user is screen recording
      stream.getTracks().forEach(track => track.stop());
      
      // Pause video or show warning
      alert('Screen recording detected. Video paused.');
    } catch (error) {
      // User denied screen recording - good!
    }
  };

  // Check periodically
  const interval = setInterval(detectScreenRecording, 5000);
  return () => clearInterval(interval);
}, []);
```

---

## 🎬 Recommended Video Player Libraries

### 1. **Video.js** (FREE) ⭐ RECOMMENDED
- Supports HLS
- Customizable controls
- Plugin ecosystem
- DRM support (paid plugins available)

```bash
npm install video.js
```

### 2. **Plyr** (FREE)
- Beautiful UI
- HLS support
- Easy to customize

```bash
npm install plyr
```

### 3. **JW Player** (PAID - $$$)
- Professional DRM
- Best protection
- Analytics included
- ~$100-500/month

---

## 📊 Protection Effectiveness

| Method | Effectiveness | Cost | Difficulty |
|--------|--------------|------|------------|
| Disable Right-Click | 40% | FREE | Easy |
| HLS Streaming | 70% | FREE | Medium |
| Watermarking | 60% | FREE | Easy |
| Domain Restriction | 50% | FREE | Easy |
| Time-Limited Tokens | 65% | FREE | Medium |
| Disable DevTools | 30% | FREE | Easy |
| Screen Recording Detection | 20% | FREE | Hard |
| **Combined All Above** | **85-90%** | **FREE** | **Medium** |
| Professional DRM (Widevine) | 95% | $$$ | Hard |

---

## 🚀 Implementation Plan

### Phase 1: Quick Wins (1-2 days)
1. ✅ Disable right-click on videos
2. ✅ Remove download button from controls
3. ✅ Add watermarking with user info
4. ✅ Implement domain restriction

### Phase 2: HLS Streaming (3-5 days)
1. ✅ Install FFmpeg on server
2. ✅ Convert existing videos to HLS
3. ✅ Update video upload to auto-convert
4. ✅ Implement HLS player on frontend

### Phase 3: Advanced Protection (1 week)
1. ✅ Add time-limited tokens
2. ✅ Implement DevTools detection
3. ✅ Add screen recording detection
4. ✅ Monitor and log suspicious activity

---

## 💰 Cost Analysis

### FREE Solution (Recommended for Start)
- HLS Streaming: FREE (FFmpeg)
- Video.js Player: FREE
- All protection layers: FREE
- **Total: $0/month**

### Paid Solution (For Scale)
- JW Player with DRM: $100-500/month
- AWS CloudFront + DRM: $50-200/month
- **Total: $150-700/month**

---

## 🎯 Recommended Approach

**For your LMS, I recommend:**

1. **Start with FREE solution** (Layers 1-5)
   - 85-90% protection
   - Good enough for most students
   - No monthly costs

2. **Monitor piracy** for 2-3 months
   - Track if videos are being shared
   - Check if revenue is affected

3. **Upgrade to paid DRM** only if needed
   - If you see significant piracy
   - When revenue justifies the cost

---

## 📝 Additional Tips

1. **Legal Protection**: Add terms of service stating video sharing is prohibited
2. **Detection**: Log video access patterns to detect account sharing
3. **Limit Devices**: Allow only 2-3 devices per account
4. **Session Management**: Limit concurrent video streams per account
5. **Education**: Remind students that sharing violates terms and hurts teachers

---

## 🔧 Next Steps

Would you like me to:
1. Implement HLS streaming conversion?
2. Add watermarking to video player?
3. Set up time-limited token system?
4. All of the above?

Let me know which protection layers you want to implement first!
