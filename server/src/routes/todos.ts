import { Router, Request, Response } from 'express';
import { body, check } from 'express-validator';
import { validateRequest } from '../middlewares/validateRequest';
import { TodoList } from "../../../shared/models/TodoList";

const router = Router();
const todoList = new TodoList();

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

router.post('/', titleValidators, validateRequest, (req: Request, res: Response) => {
    const todo = todoList.add(req.body.title);
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

router.put('/:id', [...idValidators, ...titleValidators, ...completedValidators], validateRequest, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const completed = req.body.completed;
    const todo = todoList.getById(id);

    if (!todo) {
        res.status(404).send('Todo not found');
    } else {
        todo.title = req.body.title;
        todo.completed = completed;

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