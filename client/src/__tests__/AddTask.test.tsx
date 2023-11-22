import { describe, it, expect, afterEach, vitest } from 'vitest';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import AddTask from '../components/AddTask';

describe('AddTask', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
    });

    it('renders without crashing', () => {
        const { getByPlaceholderText } = render(<AddTask tasks={[]} setTasks={() => {}} />);
        expect(getByPlaceholderText("Enter task's name")).toBeDefined();
    });

    it('handles input change', () => {
        const { getByPlaceholderText } = render(<AddTask tasks={[]} setTasks={() => {}} />);
        const input = getByPlaceholderText("Enter task's name") as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'New Task' } });
        expect(input.value).toBe('New Task');
    });

    it('handles add task button click', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify({ id: 1, title: 'New Task', completed: false }));
        };

        const mockSetTasks = vitest.fn();
        const { getByPlaceholderText, getByRole } = render(<AddTask tasks={[]} setTasks={mockSetTasks} />);
        const input = getByPlaceholderText("Enter task's name");
        fireEvent.change(input, { target: { value: 'New Task' } });
        fireEvent.click(getByRole('button'));
        await waitFor(() => expect(mockSetTasks).toHaveBeenCalledWith([{ id: 1, title: 'New Task', completed: false }]));
    });

    it('handles enter key press', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify({ id: 1, title: 'New Task', completed: false }));
        };

        const mockSetTasks = vitest.fn();
        const { getByPlaceholderText } = render(<AddTask tasks={[]} setTasks={mockSetTasks} />);
        const input = getByPlaceholderText("Enter task's name");
        fireEvent.change(input, { target: { value: 'New Task' } });
        fireEvent.submit(input);
        await waitFor(() => expect(mockSetTasks).toHaveBeenCalledWith([{ id: 1, title: 'New Task', completed: false }]));
    });

    it('handles add task button click with error', async () => {
        global.fetch = async () => {
            return Promise.reject({ msg: 'Error message' });
        };

        const mockSetTasks = vitest.fn();
        const { getByPlaceholderText, getByRole, getByText } = render(<AddTask tasks={[]} setTasks={mockSetTasks} />);
        const input = getByPlaceholderText("Enter task's name");
        fireEvent.change(input, { target: { value: 'New Task' } });
        fireEvent.click(getByRole('button'));
        await waitFor(() => expect(getByText('Error message')).toBeDefined());
    });
});