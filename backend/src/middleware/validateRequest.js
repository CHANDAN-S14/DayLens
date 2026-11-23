import { validationResult } from 'express-validator';
import { ApiResponse } from '../utils/apiResponse.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg
    }));
    return ApiResponse.error(res, 'Validation error in request parameters', 400, formattedErrors);
  }
  next();
};
