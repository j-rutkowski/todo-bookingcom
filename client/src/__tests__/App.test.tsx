import { describe, it, expect, afterEach, vitest } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import App from '../App';

describe('App', () => {
    const originalFetch = global.fetch;

    afterEach(() => {
        cleanup();
        global.fetch = originalFetch;
    });

    it('renders without crashing', () => {
        const { getByText } = render(<App />);
        expect(getByText('Your todo list')).toBeDefined();
    });

    it('fetches tasks from the server when the component mounts', async () => {
        global.fetch = async () => {
            return new Response(JSON.stringify([{ id: 1, title: 'Test Task', completed: false }]));
        };

        render(<App />);
        await waitFor(() => expect(screen.getByText('Test Task')).toBeDefined());
    });

    it('handles fetch tasks error', async () => {
        global.fetch = async () => {
            return Promise.reject({ msg: 'Error message' });
        };

        const consoleError = console.error;
        console.error = vitest.fn();

        render(<App />);
        await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error message'));
        console.error = consoleError;
    });
});