import express from 'express';
import { protect, requireTeacher } from '../modules/shared/middleware/auth';
import {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '../controllers/employeeController';

const router = express.Router();

// All employee routes require teacher access
router.use(protect, requireTeacher);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);

export default router;
