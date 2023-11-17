import express, { NextFunction, Request, Response } from 'express';
import todoRoutes from './routes/todos';

const app = express();
const port = process.env.PORT || 3999;

app.use(express.json()); // Add this line to enable JSON parsing in the request body
app.use('/api/todos', todoRoutes); // Add this line to mount the Task API routes

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

export const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});