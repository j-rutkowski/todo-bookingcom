import './App.scss'
import { TaskType } from "../../shared/models/TaskType.ts";
import { useEffect, useState } from "react";
import Task from './components/Task.tsx';
import AddTask from "./components/AddTask.tsx";

function App() {
    const [tasks, setTasks] = useState<TaskType[]>([]);

    /**
     * Fetches tasks from the server.
     *
     * @returns {Promise<TaskType[]>} A promise that resolves to an array of tasks.
     * @throws Will throw an error if the server response is not ok.
     */
    const fetchTasks = async (): Promise<TaskType[]> => {
        const response = await fetch('http://localhost:3000/api/tasks', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            return Promise.reject(errorData.errors[0]);
        }

        return await response.json();
    }

    /**
     * Fetches tasks from the server when the component mounts.
     * Updates the tasks state with the fetched tasks.
     */
    useEffect(() => {
        fetchTasks()
            .then((tasks: TaskType[]) => {
                setTasks(tasks);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div className='container'>
            <h1>Your todo list</h1>
            <AddTask tasks={tasks} setTasks={setTasks} />
            <ul className='task-list'>
                {tasks
                    .sort((a, b) => {
                        if (a.completed === b.completed) {
                            return a.id - b.id;
                        } else if (a.completed) {
                            return 1;
                        } else {
                            return -1;
                        }
                    })
                    .map((task: TaskType) =>
                        <Task key={task.id}
                              task={task}
                              tasks={tasks}
                              setTasks={setTasks}
                        />
                )}
            </ul>
        </div>
    )
}

export default App
