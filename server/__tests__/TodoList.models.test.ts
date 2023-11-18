import { TodoList } from "../../shared/models/TodoList";
import { Todo } from "../../shared/models/Todo";

describe("TodoList", () => {
    let todoList: TodoList;

    // Set up a new TodoList instance before each test.
    beforeEach(() => {
        todoList = new TodoList();
    });

    it("should add a todo", () => {
        const todo: Todo = { id: 1, title: "Example Todo", completed: false };

        todoList.add(todo.title);

        expect(todoList.getAll()).toContainEqual(todo);
    });

    it("should not add a todo with an empty title", () => {
        expect(() => todoList.add("")).toThrow("Todo title cannot be empty");
    });

    it("should get all todos", () => {
        const todos: Todo[] = [
            { id: 1, title: "Todo 1", completed: false },
            { id: 2, title: "Todo 2", completed: false },
        ];
        todos.forEach((todo) => todoList.add(todo.title));

        expect(todoList.getAll()).toEqual(expect.arrayContaining(todos));
    });

    it("should get todo by id", () => {
        const todo: Todo = { id: 1, title: "Example Todo", completed: false };
        todoList.add(todo.title);

        expect(todoList.getById(1)).toEqual(todo);
        expect(todoList.getById(2)).toBeUndefined();
    });

    it("should return undefined when getting a todo by an id that doesn't exist", () => {
        expect(todoList.getById(999)).toBeUndefined();
    });

    it("should remove todo by id", () => {
        const todo: Todo = { id: 1, title: "Example Todo", completed: false };
        todoList.add(todo.title);

        expect(todoList.removeById(1)).toBeTruthy();
        expect(todoList.removeById(2)).toBeFalsy();
        expect(todoList.getAll()).not.toContain(todo);
    });

    it("should return false when removing a todo that doesn't exist", () => {
        expect(todoList.removeById(999)).toBeFalsy();
    });

    it("should get the number of todos", () => {
        const todos: Todo[] = [
            { id: 1, title: "Todo 1", completed: false },
            { id: 2, title: "Todo 2", completed: false },
            { id: 3, title: "Todo 3", completed: false },
        ];

        todos.forEach((todo) => todoList.add(todo.title));

        expect(todoList.size()).toBe(todos.length);
    });
});
