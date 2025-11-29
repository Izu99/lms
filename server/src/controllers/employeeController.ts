import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

/**
 * Get all employees (paper_manager and video_manager only)
 * Only accessible by teachers
 */
export const getAllEmployees = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const employees = await User.find({
            role: { $in: ['paper_manager', 'video_manager'] }
        })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: employees
        });
    } catch (error: any) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employees',
            error: error.message
        });
    }
};

/**
 * Get employee by ID
 * Only accessible by teachers
 */
export const getEmployeeById = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        const employee = await User.findOne({
            _id: id,
            role: { $in: ['paper_manager', 'video_manager'] }
        }).select('-password');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error: any) {
        console.error('Error fetching employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employee',
            error: error.message
        });
    }
};

/**
 * Create new employee (paper_manager or video_manager)
 * Only accessible by teachers
 */
export const createEmployee = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { username, email, password, firstName, lastName, phoneNumber, role } = req.body;

        // Validate role
        if (role !== 'paper_manager' && role !== 'video_manager') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be paper_manager or video_manager'
            });
        }

        // Check if username exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists'
            });
        }

        // Check if email exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        // Check if phone number exists
        const existingPhone = await User.findOne({ phoneNumber });
        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: 'Phone number already exists'
            });
        }

        // Create employee
        const employee = new User({
            username,
            email,
            password, // Will be hashed by the pre-save hook
            firstName,
            lastName,
            phoneNumber,
            role,
            status: 'active' // Employees are active by default
        });

        await employee.save();

        const { password: _, ...employeeResponse } = employee.toObject();

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employeeResponse
        });
    } catch (error: any) {
        console.error('Error creating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create employee',
            error: error.message
        });
    }
};

/**
 * Update employee
 * Only accessible by teachers
 */
export const updateEmployee = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { username, email, firstName, lastName, phoneNumber, role, status, password } = req.body;

        // Find employee
        const employee = await User.findOne({
            _id: id,
            role: { $in: ['paper_manager', 'video_manager'] }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Validate role if changing
        if (role && role !== 'paper_manager' && role !== 'video_manager') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be paper_manager or video_manager'
            });
        }

        // Check for duplicate username (if changing)
        if (username && username !== employee.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(409).json({
                    success: false,
                    message: 'Username already exists'
                });
            }
        }

        // Check for duplicate email (if changing)
        if (email && email !== employee.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Check for duplicate phone (if changing)
        if (phoneNumber && phoneNumber !== employee.phoneNumber) {
            const existingPhone = await User.findOne({ phoneNumber });
            if (existingPhone) {
                return res.status(409).json({
                    success: false,
                    message: 'Phone number already exists'
                });
            }
        }

        // Update fields
        if (username) employee.username = username;
        if (email) employee.email = email;
        if (firstName) employee.firstName = firstName;
        if (lastName) employee.lastName = lastName;
        if (phoneNumber) employee.phoneNumber = phoneNumber;
        if (role) employee.role = role as any;
        if (status) employee.status = status as any;

        // Update password if provided
        if (password) {
            employee.password = password; // Will be hashed by the pre-save hook
        }

        await employee.save();

        const { password: _, ...employeeResponse } = employee.toObject();

        res.status(200).json({
            success: true,
            message: 'Employee updated successfully',
            data: employeeResponse
        });
    } catch (error: any) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update employee',
            error: error.message
        });
    }
};

/**
 * Delete employee
 * Only accessible by teachers
 */
export const deleteEmployee = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;

        const employee = await User.findOneAndDelete({
            _id: id,
            role: { $in: ['paper_manager', 'video_manager'] }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error: any) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete employee',
            error: error.message
        });
    }
};
