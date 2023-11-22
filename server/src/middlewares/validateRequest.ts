import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware function to validate the request.
 *
 * This function uses the `express-validator` library to validate the request.
 * If there are validation errors, it sends a 400 response with the errors.
 * Otherwise, it calls the next middleware function.
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function.
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};