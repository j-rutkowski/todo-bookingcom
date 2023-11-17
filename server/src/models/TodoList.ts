import { Todo } from "./Todo";

export class TodoList {
    private todos: Todo[] = [];

    /**
     * Adds a new TODO item to the list.
     * @param todo - The TODO item to be added.
     */
    public add(todo: Todo): void {
        this.todos.push(todo);
    }

    /**
     * Retrieves all TODO items in the list.
     * @returns An array of TODO items.
     */
    public getAll(): Todo[] {
        return this.todos;
    }

    /**
     * Retrieves a TODO item by its ID.
     * @param id - The ID of the TODO item to retrieve.
     * @returns The TODO item with the specified ID, or undefined if not found.
     */
    public getById(id: number): Todo | undefined {
        return this.todos.find((t) => t.id === id);
    }

    /**
     * Removes a TODO item by its ID.
     * @param id - The ID of the TODO item to remove.
     * @returns true if the item was successfully removed, false if the item was not found.
     */
    public removeById(id: number): boolean {
        const index = this.todos.findIndex((t) => t.id === id);

        if (index === -1) {
            return false;
        } else {
            this.todos.splice(index, 1);
            return true;
        }
    }

    /**
     * Gets the number of TODO items in the list.
     * @returns The number of TODO items.
     */
    public size(): number {
        return this.todos.length;
    }
}