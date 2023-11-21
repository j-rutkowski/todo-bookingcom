import './AddTask.scss';
import { useState } from "react";
import { TaskType } from "../types/TaskType.ts";
import { addTask } from "../services/tasks.service.ts";

type AddTaskProps = {
    tasks: TaskType[];
    setTasks: (tasks: TaskType[]) => void;
}

function AddTask({ tasks, setTasks }: AddTaskProps) {
    const [taskName, setTaskName] = useState('');
    const [error, setError] = useState('');

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
            // Blur the input when submitting the task
            const input = e.target as HTMLInputElement;
            input.blur();

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
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                        <path fill="#FFFFFF" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
                    </svg>
                </button>
            </div>
            <span className={`add-task__error ${error ? '' : 'hidden'}`}>{error}</span>
        </div>
    )
}

export default AddTask;