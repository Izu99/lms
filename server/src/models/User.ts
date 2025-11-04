import mongoose, { Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

export type Role = 'student' | 'teacher' | 'admin';
export type StudentStatus = 'active' | 'inactive' | 'pending' | 'paid' | 'unpaid';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  institute?: string;
  year?: Types.ObjectId;
  phoneNumber?: string;
  whatsappNumber?: string;
  telegram?: string;
  idCardImage?: string;
  role: Role;
  status?: StudentStatus; // Added status field
  notes?: string; // Added notes for teachers to add comments
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  institute: { type: String },
  year: { type: mongoose.Schema.Types.ObjectId, ref: 'Year' },
  phoneNumber: { type: String },
  whatsappNumber: { type: String },
  telegram: { type: String },
  idCardImage: { type: String },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending', 'paid', 'unpaid'], 
    default: 'pending' 
  },
  notes: { type: String }
}, { timestamps: true });

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
