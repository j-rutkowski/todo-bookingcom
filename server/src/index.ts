import express, { NextFunction, Request, Response } from 'express';
import taskRoutes from './routes/task';
import cors from 'cors';
import swaggerDocs from "./lib/swagger";
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json()); // Enable JSON parsing in the request body
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Mount the Swagger UI
app.use('/api/task', taskRoutes); // Mount the Task API routes

// Handle internal server errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

// Start the server and export it for testing purposes
export const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Documentation available at http://localhost:3000/api-docs');
});