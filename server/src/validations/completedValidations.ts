import { body } from 'express-validator';

export const completedValidations = [
    body('completed').exists().withMessage('Completed is required'),
    body('completed').isBoolean().withMessage('Completed must be a boolean'),
];