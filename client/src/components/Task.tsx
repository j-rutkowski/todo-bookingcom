import './Task.scss';
import { TaskType } from "../types/TaskType.ts";
import { removeTask, updateTask } from "../services/tasks.service.ts";
import { Reorder } from 'framer-motion';

type TaskProps = {
    task: TaskType;
    tasks: TaskType[];
    setTasks: (tasks: TaskType[]) => void;
}

function Task({ task, tasks, setTasks }: TaskProps) {

    /**
     * Handles the click event of a task.
     * Calls the updateTask function and updates the state based on the result.
     */
    const handleTaskClick = () => {
        task.completed = !task.completed;

        updateTask(task)
            .then(updatedTask => {
                const updatedTasks = [...tasks];
                updatedTasks[tasks.findIndex(t => t.id === task.id)] = updatedTask;
                setTasks(updatedTasks);
            })
            .catch(error => {
                console.error(error.msg);
            });
    }

    /**
     * Handles the deletion of a task.
     * Calls the removeTask function and updates the state based on the result.
     */
    const handleTaskDelete = () => {
        removeTask(task.id)
            .then(() => {
                const updatedTasks = [...tasks];
                updatedTasks.splice(tasks.findIndex(t => t.id === task.id), 1);
                setTasks(updatedTasks);
            })
            .catch(error => {
                console.error(error.msg);
            });
    }

    return (
        <Reorder.Item value={task} drag={false} className={`task ${task.completed ? 'checked' : ''}`}>
            <label className='task__label'>
                <span>{task.title}</span>
                <input
                    type='checkbox'
                    onChange={handleTaskClick}
                    checked={task.completed}
                    className='task__checkbox'
                />
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
                     className="task__check">
                    <path fill="#FFFFFF" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
                </svg>
            </label>
            <button className='task__delete' onClick={handleTaskDelete}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 448 512">
                    <path fill="#919191" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                </svg>
            </button>
        </Reorder.Item>
    );
}

export default Task;