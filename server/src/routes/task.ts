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
 * @openapi
 * /api/task:
 *   post:
 *     tags:
 *       - task
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The task title
 *                 example: My new task
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 * @openapi
 * /api/task:
 *   get:
 *     tags:
 *       - task
 *     summary: Get all tasks
 *     responses:
 *       200:
 *         description: The tasks were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', validateRequest, async (req: Request, res: Response) => {
    const tasks = await prisma.task.findMany();

    res.json(tasks);
});

/**
 * @openapi
 * /api/task/{id}:
 *   get:
 *     tags:
 *       - task
 *     summary: Get a task by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: The task was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
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
 * @openapi
 * /api/task/{id}:
 *   put:
 *     tags:
 *       - task
 *     summary: Update a task by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
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
 * @openapi
 * /api/task/{id}:
 *   delete:
 *     tags:
 *       - task
 *     summary: Delete a task by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the task
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: The task was successfully deleted
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Task not found
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