"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(res, data, message = 'Success', statusCode = 200) {
        const response = {
            success: true,
            message,
            data
        };
        return res.status(statusCode).json(response);
    }
    static error(res, message, statusCode = 400, error) {
        const response = {
            success: false,
            message,
            error
        };
        return res.status(statusCode).json(response);
    }
    static paginated(res, data, currentPage, totalItems, itemsPerPage, message = 'Success') {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const response = {
            success: true,
            message,
            data: {
                data,
                pagination: {
                    currentPage,
                    totalPages,
                    totalItems,
                    itemsPerPage,
                    hasNextPage: currentPage < totalPages,
                    hasPrevPage: currentPage > 1
                }
            }
        };
        return res.status(200).json(response);
    }
    static unauthorized(res, message = 'Unauthorized') {
        return this.error(res, message, 401);
    }
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }
    static serverError(res, message = 'Internal server error') {
        return this.error(res, message, 500);
    }
}
exports.ResponseHelper = ResponseHelper;
