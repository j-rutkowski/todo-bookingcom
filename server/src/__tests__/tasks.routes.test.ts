import request = require('supertest');
import { server } from '../index';
import { TaskType } from '../../../client/src/types/TaskType';
import prisma from '../lib/__mocks__/prisma';
import { afterAll, describe, it, expect, vi } from 'vitest';

// Mock Prisma client
vi.mock('../lib/prisma');

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
        prisma.task.create.mockResolvedValueOnce(mockTask);
        const response = await request(server)
            .post('/api/task')
            .send({ title: 'Test Task' });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe('Test Task');
    });

    it('should return 400 if title is not provided', async () => {
        const response = await request(server)
            .post('/api/task')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            'type': 'field',
            'msg': 'Title is required',
            'path': 'title',
            'location': 'body'
        });
    });

    it('should return 400 if title is not a string', async () => {
        const response = await request(server)
            .post('/api/task')
            .send({ title: 123 });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            'type': 'field',
            'value': 123,
            'msg': 'Title must be a string',
            'path': 'title',
            'location': 'body'
        });
    });

    it('should return 400 if title is longer than 100 chars', async () => {
        const response = await request(server)
            .post('/api/task')
            .send({ title: 'a'.repeat(101) });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            'type': 'field',
            'value': 'a'.repeat(101),
            'msg': 'Title cannot be longer than 100 characters',
            'path': 'title',
            'location': 'body'
        });
    });

    // Test GET endpoint
    it('should get all Tasks', async () => {
        prisma.task.findMany.mockResolvedValueOnce([mockTask]);
        const response = await request(server).get('/api/task');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockTask]);
    });

    // Test GET by ID endpoint
    it('should get a Task by ID', async () => {
        prisma.task.findUnique.mockResolvedValueOnce(mockTask);
        const response = await request(server).get('/api/task/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockTask);
        expect(prisma.task.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            }
        });
    });

    it('should return 404 if no Task with given ID exists', async () => {
        prisma.task.findUnique.mockResolvedValueOnce(null);
        const response = await request(server).get('/api/task/999');

        expect(response.status).toBe(404);
        expect(response.text).toBe('Task not found');
    });

    it('should return 400 if id is not an integer', async () => {
        const response = await request(server).get('/api/task/string');

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            'type': 'field',
            'value': 'string',
            'msg': 'ID must be an integer',
            'path': 'id',
            'location': 'params'
        });
    });

    it('should return 400 if id is less than 1', async () => {
        const response = await request(server).get('/api/task/0');

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            'type': 'field',
            'value': '0',
            'msg': 'ID must be greater than 0',
            'path': 'id',
            'location': 'params'
        });
    });

    // Test PUT endpoint
    it('should update a Task by ID', async () => {
        const completedTask: TaskType = {
            id: 1,
            title: 'Updated Task',
            completed: true,
        };
        prisma.task.update.mockResolvedValueOnce(completedTask);
        prisma.task.findUnique.mockResolvedValueOnce(completedTask);

        const response = await request(server)
            .put(`/api/task/${completedTask.id}`)
            .send({ title: completedTask.title, completed: completedTask.completed });

        const updatedTask = await request(server)
            .get(`/api/task/${completedTask.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(completedTask);
        expect(updatedTask.body).toEqual(completedTask);
    });

    it('should return 404 if no Task with given ID exists', async () => {
        prisma.task.update.mockImplementationOnce(() => {
            throw new Error();
        });

        const response = await request(server)
            .put('/api/task/999')
            .send(mockTask);

        expect(response.status).toBe(404);
        expect(response.text).toBe('Task not found');
    });

    it('should return 400 when updating a task with an invalid completed status', async () => {
        const response = await request(server)
            .put('/api/task/1')
            .send({ title: 'New Title', completed: 'invalid' });

        expect(response.status).toBe(400);
        expect(response.body.errors).toContainEqual({
            'type': 'field',
            'value': 'invalid',
            'msg': 'Completed must be a boolean',
            'path': 'completed',
            'location': 'body'
        });
    });

    // Test DELETE endpoint
    it('should delete a Task by ID', async () => {
        const response = await request(server).delete('/api/task/1');

        expect(response.status).toBe(204);
    });

    it('should return 404 if no Task with given ID exists', async () => {
        prisma.task.delete.mockImplementationOnce(() => {
            throw new Error();
        });

        const response = await request(server).delete('/api/task/999');

        expect(response.status).toBe(404);
    });
});
