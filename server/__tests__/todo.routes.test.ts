import request = require('supertest');
import { server } from '../src';
import { Todo } from '../src/models/Todo';

// Mock todo for testing
const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    completed: false,
};

// Close the server after all tests have run
afterAll(() => {
    server.close();
});

describe('Todo API Endpoints', () => {
    // Test POST endpoint
    it('should create a new Todo', async () => {
        const response = await request(server)
            .post('/api/todos')
            .send({ title: 'Test Todo' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Todo');
    });

    it('should return 400 if title is not provided', async () => {
        const response = await request(server)
            .post('/api/todos')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            "type": "field",
            "msg": "Title is required",
            "path": "title",
            "location": "body"
        });
    });

    it('should return 400 if title is not a string', async () => {
        const response = await request(server)
            .post('/api/todos')
            .send({ title: 123 });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            "type": "field",
            "value": 123,
            "msg": "Title must be a string",
            "path": "title",
            "location": "body"
        });
    });

    it('should return 400 if title is longer than 100 chars', async () => {
        const response = await request(server)
            .post('/api/todos')
            .send({ title: 'a'.repeat(101) });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            "type": "field",
            "value": "a".repeat(101),
            "msg": "Title cannot be longer than 100 characters",
            "path": "title",
            "location": "body"
        });
    });

    // Test GET endpoint
    it('should get all Todos', async () => {
        const response = await request(server).get('/api/todos');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockTodo]);
    });

    // Test GET by ID endpoint
    it('should get a Todo by ID', async () => {
        const response = await request(server).get('/api/todos/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockTodo);
    });

    it('should return 404 if no Todo with given ID exists', async () => {
        const response = await request(server).get('/api/todos/999');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Todo not found');
    });

    it('should return 400 if id is not an integer', async () => {
        const response = await request(server).get('/api/todos/string');

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            "type": "field",
            "value": "string",
            "msg": "ID must be an integer",
            "path": "id",
            "location": "params"
        });
    });

    it('should return 400 if id is less than 1', async () => {
        const response = await request(server).get('/api/todos/0');

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            "type": "field",
            "value": "0",
            "msg": "ID must be greater than 0",
            "path": "id",
            "location": "params"
        });
    });

    // Test PUT endpoint
    it('should update a Todo by ID', async () => {
        const response = await request(server)
            .put('/api/todos/1')
            .send({ title: 'Updated Todo', completed: true });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: 1,
            title: 'Updated Todo',
            completed: true,
        });
    });

    it('should return 404 if no Todo with given ID exists', async () => {
        const response = await request(server)
            .put('/api/todos/999')
            .send(mockTodo);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Todo not found');
    });

    it("should return 400 when updating a todo with an invalid completed status", async () => {
        const response = await request(server)
            .put(`/api/todos/1`)
            .send({ title: "New Title", completed: "invalid" });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            "type": "field",
            "value": "invalid",
            "msg": "Completed must be a boolean",
            "path": "completed",
            "location": "body"
        });
    });

    // Test DELETE endpoint
    it('should delete a Todo by ID', async () => {
        const response = await request(server).delete('/api/todos/1');

        expect(response.status).toBe(204);
    });

    it('should return 404 if no Todo with given ID exists', async () => {
        const response = await request(server).delete('/api/todos/999');

        expect(response.status).toBe(404);
    });
});
