
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  allowedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
});

export default mongoose.model('User', userSchema);
