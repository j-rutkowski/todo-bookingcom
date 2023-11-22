import { describe, it, expect, afterEach, vitest, vi } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import Task from '../components/Task';
import { TaskType } from "../types/TaskType.ts";
import { Reorder } from "framer-motion";

describe('Task', () => {
    const originalFetch = global.fetch;
    const mockTask: TaskType = { id: 1, title: 'Test Task', completed: false };
    const mockSetTasks = vitest.fn();
    const tasks: TaskType[] = [mockTask];

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
        vi.resetAllMocks();
    });

    const renderInReorderGroup = () => render(
        <Reorder.Group onReorder={mockSetTasks} values={tasks}>
            <Task task={mockTask} tasks={tasks} setTasks={mockSetTasks} />
        </Reorder.Group>
    );

        it('renders without crashing', () => {
        const { getByText } = renderInReorderGroup();
        expect(getByText('Test Task')).toBeDefined();
    });

    it('handles task click', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify({ ...mockTask, completed: true }));
        };

        const { getByText } = renderInReorderGroup();
        fireEvent.click(getByText('Test Task'));
        await waitFor(() => expect(mockSetTasks).toHaveBeenCalledWith([{ ...mockTask, completed: true }]));
    });

    it('handles task delete', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify({}));
        };

        const { getByRole } = renderInReorderGroup();
        fireEvent.click(getByRole('button'));
        await waitFor(() => expect(mockSetTasks).toHaveBeenCalledWith([]));
    });
});
