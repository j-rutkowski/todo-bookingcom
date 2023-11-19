import { describe, it, expect, afterEach } from 'vitest';
import { addTask, fetchTasks, updateTask, removeTask } from '../services/tasks.service';
import { TaskType } from "../../../shared/models/TaskType.ts";

describe('tasks.service', () => {
    const mockTask: TaskType = { id: 1, title: 'Test Task', completed: false };
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
    });

    it('adds a task', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify(mockTask));
        };

        const task = await addTask('Test Task');
        expect(task).toEqual(mockTask);
    });

    it('fetches tasks', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify([mockTask]));
        };

        const tasks = await fetchTasks();
        expect(tasks).toEqual([mockTask]);
    });

    it('updates a task', async () => {
        const updatedTask = { ...mockTask, completed: true };
        global.fetch = async () => {
            return new Response(JSON.stringify(updatedTask));
        };

        const task = await updateTask(updatedTask);
        expect(task).toEqual(updatedTask);
    });

    it('removes a task', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify({}));
        };

        await expect(removeTask(mockTask.id)).resolves.toBeUndefined();
    });

    it('handles add task error', async () => {
        global.fetch = async () => {
            return Promise.reject({ msg: 'Error message' });
        };

        await expect(addTask('Test Task')).rejects.toEqual({ msg: 'Error message' });
    });

    it('handles fetch tasks error', async () => {
        global.fetch = async () => {
            return Promise.reject({ msg: 'Error message' });
        };

        await expect(fetchTasks()).rejects.toEqual({ msg: 'Error message' });
    });

    it('handles update task error', async () => {
        const task = { id: 1, title: 'Test Task', completed: false };
        global.fetch = async () => {
            return Promise.reject({ msg: 'Error message' });
        };

        await expect(updateTask(task)).rejects.toEqual({ msg: 'Error message' });
    });

    it('handles remove task error', async () => {
        global.fetch = async () => {
            return Promise.reject({ msg: 'Error message' });
        };

        await expect(removeTask(1)).rejects.toEqual({ msg: 'Error message' });
    });
});