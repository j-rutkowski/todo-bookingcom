import './AddTask.scss';
import { useState } from "react";
import { TaskType } from "../../../shared/models/TaskType.ts";

type AddTaskProps = {
    tasks: TaskType[];
    setTasks: (tasks: TaskType[]) => void;
}

function AddTask({ tasks, setTasks }: AddTaskProps) {
    const [taskName, setTaskName] = useState('');
    const [error, setError] = useState('');

    /**
     * Adds a new task to the server.
     *
     * @param {string} taskName - The name of the task to add.
     * @returns {Promise<TaskType>} A promise that resolves to the added task.
     * @throws Will throw an error if the server response is not ok.
     */
    const addTask = async (taskName: string): Promise<TaskType> => {
        const response = await fetch('http://localhost:3000/api/tasks', {
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
     * Handles the click event of the add task button.
     * Calls the addTask function and updates the state based on the result.
     */
    const handleClick = () => {
        addTask(taskName)
            .then((task: TaskType) => {
                setTaskName('');
                setTasks([...tasks, task]);
            })
            .catch(error => {
                setError(error.msg);
            });
    }

    /**
     * Handles the key down event of the input field.
     * Calls the handleClick function if the user presses the enter key.
     * @param {React.KeyboardEvent<HTMLInputElement>} e - The key down event.
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (error)  {
            setError('');
        }

        if (e.key === 'Enter') {
            handleClick();
        }
    }

    return (
        <div className='add-task'>
            <div className='add-task__container'>
                <input
                    type='text'
                    placeholder="Enter task's name"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    className='add-task__input'
                />
                <button
                    className='add-task__button'
                    onClick={handleClick}
                >
                    Add
                </button>
            </div>
            <span className={`add-task__error ${error ? '' : 'hidden'}`}>{error}</span>
        </div>
    )
}

export default AddTask;