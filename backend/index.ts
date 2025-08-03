import express from 'express'; 
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import authRoutes from './src/routes/auth';
import videoRoutes from './src/routes/videos';
import userRoutes from './src/routes/users';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

// SINGLE error middleware at end
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Unhandled error:', err);
  const message = err?.message || err || 'Something went wrong';
  res.status(500).json({ message });
});


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(error.message));
