import { body } from 'express-validator';

export const titleValidations = [
    body('title').exists().withMessage('Title is required'),
    body('title').isString().withMessage('Title must be a string'),
    body('title').isLength({ min: 1 }).withMessage('Title cannot be empty'),
    body('title').isLength({ max: 100 }).withMessage('Title cannot be longer than 100 characters'),
];