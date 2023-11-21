import { describe, it, expect, afterEach, vitest } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import Task from '../components/Task';
import { TaskType } from "../types/TaskType.ts";

describe('Task', () => {
    const originalFetch = global.fetch;
    const mockTask: TaskType = { id: 1, title: 'Test Task', completed: false };
    const mockSetTasks = vitest.fn();
    const tasks: TaskType[] = [mockTask];

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
    });

    it('renders without crashing', () => {
        const { getByText } = render(<Task task={mockTask} tasks={tasks} setTasks={mockSetTasks} />);
        expect(getByText('Test Task')).toBeDefined();
    });

    it('handles task click', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify({ ...mockTask, completed: true }));
        };

        const { getByText } = render(<Task task={mockTask} tasks={tasks} setTasks={mockSetTasks} />);
        fireEvent.click(getByText('Test Task'));
        await waitFor(() => expect(mockSetTasks).toHaveBeenCalledWith([{ ...mockTask, completed: true }]));
    });

    it('handles task delete', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify({}));
        };

        const { getByRole } = render(<Task task={mockTask} tasks={tasks} setTasks={mockSetTasks} />);
        fireEvent.click(getByRole('button'));
        await waitFor(() => expect(mockSetTasks).toHaveBeenCalledWith([]));
    });
});
