import express, { NextFunction, Request, Response } from 'express';
import todoRoutes from './routes/todos';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing in the request body
app.use('/api/todos', todoRoutes); // Mount the Task API routes

// Handle internal server errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

// Start the server and export it for testing purposes
export const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});