import { Router, Request, Response } from 'express';
import { body, check } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import prisma from "../lib/prisma";

const router = Router();

const titleValidators = [
    body('title').exists().withMessage('Title is required'),
    body('title').isString().withMessage('Title must be a string'),
    body('title').isLength({ min: 1 }).withMessage('Title cannot be empty'),
    body('title').isLength({ max: 100 }).withMessage('Title cannot be longer than 100 characters'),
];
const completedValidators = [
    body('completed').exists().withMessage('Completed is required'),
    body('completed').isBoolean().withMessage('Completed must be a boolean'),
];
const idValidators = [
    check('id').exists().withMessage('ID is required'),
    check('id').isInt().withMessage('ID must be an integer'),
    check('id').isInt({ min: 1 }).withMessage('ID must be greater than 0'),
];

/**
 * POST endpoint /api/tasks
 * Create a new Task
 * @param title
 * @returns the created Task
 */
router.post('/', titleValidators, validateRequest, async (req: Request, res: Response) => {
    const title = req.body.title;
    const task = await prisma.task.create({
        data: {
            title: title,
        }
    });

    res.status(201).json(task);
});

/**
 * GET endpoint /api/tasks
 * Get all Tasks
 * @returns all Tasks
 */
router.get('/', validateRequest, async (req: Request, res: Response) => {
    const tasks = await prisma.task.findMany();

    res.json(tasks);
});

/**
 * GET endpoint /api/tasks/:id
 * Get a single Task by ID
 * @param id
 * @returns the Task with the given ID
 */
router.get('/:id', idValidators, validateRequest, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const task = await prisma.task.findUnique({
        where: {
            id: id,
        }
    });

    if (!task) {
        res.status(404).send('Task not found');
    } else {
        res.json(task);
    }
});

/**
 * PUT endpoint /api/tasks/:id
 * Update a Task by ID
 * @param id
 * @param title
 * @param completed
 * @returns the updated Task
 */
router.put('/:id', [...idValidators, ...titleValidators, ...completedValidators], validateRequest, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const title = req.body.title;
    const completed = req.body.completed;

    try {
        const task = await prisma.task.update({
            where: {
                id: id,
            },
            data: {
                title: title,
                completed: completed,
            }
        });

        res.json(task);
    } catch (error) {
        res.status(404).send('Task not found');
    }
});

/**
 * DELETE endpoint /api/tasks/:id
 * Delete a Task by ID
 * @param id
 * @returns 204 No Content
 */
router.delete('/:id', idValidators, validateRequest, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    try {
        await prisma.task.delete({
            where: {
                id: id,
            }
        });

        res.status(204).send();
    } catch (error) {
        res.status(404).send('Task not found');
    }
});

export default router;