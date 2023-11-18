import request = require('supertest');
import { server } from '../src';
import { TaskType } from '../../shared/models/TaskType';

// Mock task for testing
const mockTask: TaskType = {
    id: 1,
    title: 'Test Task',
    completed: false,
};

// Close the server after all tests have run
afterAll(() => {
    server.close();
});

describe('Task API Endpoints', () => {
    // Test POST endpoint
    it('should create a new Task', async () => {
        const response = await request(server)
            .post('/api/tasks')
            .send({ title: 'Test Task' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
    });

    it('should return 400 if title is not provided', async () => {
        const response = await request(server)
            .post('/api/tasks')
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
            .post('/api/tasks')
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
            .post('/api/tasks')
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
    it('should get all Tasks', async () => {
        const response = await request(server).get('/api/tasks');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockTask]);
    });

    // Test GET by ID endpoint
    it('should get a Task by ID', async () => {
        const response = await request(server).get('/api/tasks/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockTask);
    });

    it('should return 404 if no Task with given ID exists', async () => {
        const response = await request(server).get('/api/tasks/999');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Task not found');
    });

    it('should return 400 if id is not an integer', async () => {
        const response = await request(server).get('/api/tasks/string');

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
        const response = await request(server).get('/api/tasks/0');

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
    it('should update a Task by ID', async () => {
        const completedTask: TaskType = {
            id: 1,
            title: 'Updated Task',
            completed: true,
        }
        const response = await request(server)
            .put(`/api/tasks/${completedTask.id}`)
            .send({ title: completedTask.title, completed: completedTask.completed });

        const updatedTask = await request(server)
            .get(`/api/tasks/${completedTask.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(completedTask);
        expect(updatedTask.body).toEqual(completedTask);
    });

    it('should return 404 if no Task with given ID exists', async () => {
        const response = await request(server)
            .put('/api/tasks/999')
            .send(mockTask);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Task not found');
    });

    it("should return 400 when updating a task with an invalid completed status", async () => {
        const response = await request(server)
            .put(`/api/tasks/1`)
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
    it('should delete a Task by ID', async () => {
        const response = await request(server).delete('/api/tasks/1');

        expect(response.status).toBe(204);
    });

    it('should return 404 if no Task with given ID exists', async () => {
        const response = await request(server).delete('/api/tasks/999');

        expect(response.status).toBe(404);
    });
});
