import mongoose, { Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserRole, StudentStatus } from '../modules/shared/types/common.types';

export type Role = UserRole;

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phoneNumber: string;
  whatsappNumber?: string;
  telegram?: string;
  idCardFrontImage?: string;
  idCardBackImage?: string;
  studentType?: string;
  role: UserRole;
  status?: StudentStatus; // Added status field
  notes?: string; // Added notes for teachers to add comments
  institute?: Types.ObjectId;
  year?: Types.ObjectId;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phoneNumber: { type: String, required: true, unique: true },
  whatsappNumber: { type: String },
  telegram: { type: String },
  idCardFrontImage: { type: String },
  idCardBackImage: { type: String },
  studentType: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending', 'paid', 'unpaid'], 
    default: 'pending' 
  },
  notes: { type: String },
  institute: { type: mongoose.Schema.Types.ObjectId, ref: 'Institute' },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' }
}, { timestamps: true });

// ✅ PERFORMANCE: Add indexes for faster queries
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ institute: 1, year: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
