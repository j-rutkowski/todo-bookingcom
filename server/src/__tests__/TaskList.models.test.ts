import { TaskList } from "../../../shared/models/TaskList";
import { TaskType } from "../../../shared/models/TaskType";

describe("TaskList", () => {
    let taskList: TaskList;

    // Set up a new TaskList instance before each test.
    beforeEach(() => {
        taskList = new TaskList();
    });

    it("should add a task", () => {
        const task: TaskType = { id: 1, title: "Example Task", completed: false };

        taskList.add(task.title);

        expect(taskList.getAll()).toContainEqual(task);
    });

    it("should not add a task with an empty title", () => {
        expect(() => taskList.add("")).toThrow("Task title cannot be empty");
    });

    it("should get all tasks", () => {
        const tasks: TaskType[] = [
            { id: 1, title: "Task 1", completed: false },
            { id: 2, title: "Task 2", completed: false },
        ];
        tasks.forEach((task) => taskList.add(task.title));

        expect(taskList.getAll()).toEqual(expect.arrayContaining(tasks));
    });

    it("should get task by id", () => {
        const task: TaskType = { id: 1, title: "Example Task", completed: false };
        taskList.add(task.title);

        expect(taskList.getById(1)).toEqual(task);
        expect(taskList.getById(2)).toBeUndefined();
    });

    it("should return undefined when getting a task by an id that doesn't exist", () => {
        expect(taskList.getById(999)).toBeUndefined();
    });

    it("should remove task by id", () => {
        const task: TaskType = { id: 1, title: "Example Task", completed: false };
        taskList.add(task.title);

        expect(taskList.removeById(1)).toBeTruthy();
        expect(taskList.removeById(2)).toBeFalsy();
        expect(taskList.getAll()).not.toContain(task);
    });

    it("should return false when removing a task that doesn't exist", () => {
        expect(taskList.removeById(999)).toBeFalsy();
    });

    it("should get the number of tasks", () => {
        const tasks: TaskType[] = [
            { id: 1, title: "Task 1", completed: false },
            { id: 2, title: "Task 2", completed: false },
            { id: 3, title: "Task 3", completed: false },
        ];

        tasks.forEach((task) => taskList.add(task.title));

        expect(taskList.size()).toBe(tasks.length);
    });
});
