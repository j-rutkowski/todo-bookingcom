import { TaskType } from "./TaskType";

export class TaskList {
    private tasks: TaskType[] = [];

    /**
     * Adds a new task item to the list.
     * @param title - Title of the task to be added.
     */
    public add(title: string): TaskType {
        if (title.length === 0) {
            throw new Error('Task title cannot be empty');
        }

        const task: TaskType = {
            id: this.tasks.length + 1,
            title: title,
            completed: false,
        }

        this.tasks.push(task);
        return task;
    }

    /**
     * Retrieves all task items in the list.
     * @returns An array of task items.
     */
    public getAll(): TaskType[] {
        return this.tasks;
    }

    /**
     * Retrieves a task item by its ID.
     * @param id - The ID of the task item to retrieve.
     * @returns The task item with the specified ID, or undefined if not found.
     */
    public getById(id: number): TaskType | undefined {
        return this.tasks.find((t) => t.id === id);
    }

    /**
     * Removes a task item by its ID.
     * @param id - The ID of the task item to remove.
     * @returns true if the item was successfully removed, false if the item was not found.
     */
    public removeById(id: number): boolean {
        const index = this.tasks.findIndex((t) => t.id === id);

        if (index === -1) {
            return false;
        } else {
            this.tasks.splice(index, 1);
            return true;
        }
    }

    public updateById(id: number, title: string, completed: boolean): TaskType | undefined {
        const index = this.tasks.findIndex((t) => t.id === id);

        if (index === -1) {
            return undefined;
        } else if (title.length === 0) {
            throw new Error('Task title cannot be empty');
        } else {
            this.tasks[index].title = title;
            this.tasks[index].completed = completed;
            return this.tasks[index];
        }
    }

    /**
     * Gets the number of task items in the list.
     * @returns The number of task items.
     */
    public size(): number {
        return this.tasks.length;
    }
}