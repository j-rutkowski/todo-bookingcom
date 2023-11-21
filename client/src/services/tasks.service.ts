import { TaskType } from "../types/TaskType.ts";

const BASE_URL = 'http://localhost:3000/api/task';

/**
 * Adds a new task to the server.
 *
 * @param {string} taskName - The name of the task to add.
 * @returns {Promise<TaskType>} A promise that resolves to the added task.
 * @throws Will throw an error if the server response is not ok.
 */
export const addTask = async (taskName: string): Promise<TaskType> => {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: taskName })
    });

    if (!response.ok) {
        const errorData = await response.json();
        return Promise.reject(errorData.errors[0]);
    }

    return await response.json();
}

/**
 * Fetches tasks from the server.
 *
 * @returns {Promise<TaskType[]>} A promise that resolves to an array of tasks.
 * @throws Will throw an error if the server response is not ok.
 */
export const fetchTasks = async (): Promise<TaskType[]> => {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        return Promise.reject(errorData.errors[0]);
    }

    return await response.json();
}

/**
 * Updates a task on the server.
 *
 * @param {TaskType} task - The task to update.
 * @returns {Promise<TaskType>} A promise that resolves to the updated task.
 * @throws Will throw an error if the server response is not ok.
 */
export const updateTask = async (task: TaskType): Promise<TaskType> => {
    const response = await fetch(`${BASE_URL}/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })

    if (!response.ok) {
        const errorData = await response.json();
        return Promise.reject(errorData.errors[0]);
    }

    return await response.json();
}

/**
 * Removes a task from the server.
 *
 * @param {number} id - The id of the task to remove.
 * @returns {Promise<void>} A promise that resolves when the task is removed.
 * @throws Will throw an error if the server response is not ok.
 */
export const removeTask = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        const errorData = await response.json();
        return Promise.reject(errorData.errors[0]);
    }

    return Promise.resolve();
}