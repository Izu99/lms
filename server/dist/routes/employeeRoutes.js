"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../modules/shared/middleware/auth");
const employeeController_1 = require("../controllers/employeeController");
const router = express_1.default.Router();
// All employee routes require teacher access
router.use(auth_1.protect, auth_1.requireTeacher);
router.get('/', employeeController_1.getAllEmployees);
router.get('/:id', employeeController_1.getEmployeeById);
router.post('/', employeeController_1.createEmployee);
router.put('/:id', employeeController_1.updateEmployee);
router.delete('/:id', employeeController_1.deleteEmployee);
exports.default = router;
