import { Router, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import { Todo } from '../models/Todo';
import { TodoList } from "../models/TodoList";

const router = Router();
const todoList = new TodoList();

const titleValidators = [
    body('title').exists().withMessage('Title is required'),
    body('title').isString().withMessage('Title must be a string'),
    body('title').isLength({ min: 1 }).withMessage('Title cannot be empty'),
    body('title').isLength({ max: 100 }).withMessage('Title cannot be longer than 100 characters'),
];
const idValidators = [
    check('id').exists().withMessage('ID is required'),
    check('id').isInt().withMessage('ID must be an integer'),
    check('id').isInt({ min: 1 }).withMessage('ID must be greater than 0'),
];

router.post('/', titleValidators, validateRequest, (req: Request, res: Response) => {
    const todo: Todo = {
        id: todoList.size() + 1,
        title: req.body.title,
        completed: false,
    };

    todoList.add(todo);
    res.status(201).json(todo);
});

router.get('/', validateRequest, (req: Request, res: Response) => {
    res.json(todoList.getAll());
});

router.get('/:id', idValidators, validateRequest, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const todo = todoList.getById(id);

    if (!todo) {
        res.status(404).send('Todo not found');
    } else {
        res.json(todo);
    }
});

router.delete('/:id', idValidators, validateRequest, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    if (todoList.removeById(id)) {
        res.status(204).send();
    } else {
        res.status(404).send('Todo not found');
    }
});

export default router;