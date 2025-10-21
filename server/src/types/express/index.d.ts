import { Request } from 'express';
import { User } from '../../models/User'; // Adjust path as needed

declare global {
  namespace Express {
    interface Request {
      user?: User; // Assuming User is your user model interface
    }
  }
}
