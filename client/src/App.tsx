import './App.scss'
import { TaskType } from "./types/TaskType.ts";
import { useEffect, useState } from "react";
import Task from './components/Task.tsx';
import AddTask from "./components/AddTask.tsx";
import { fetchTasks } from "./services/tasks.service.ts";
import { Reorder } from "framer-motion";

function App() {
    const [tasks, setTasks] = useState<TaskType[]>([]);

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
                console.error(error.msg);
            });
    }, []);

    return (
        <div className='container'>
            <h1>Your todo list</h1>
            <AddTask tasks={tasks} setTasks={setTasks} />
            <Reorder.Group values={tasks} onReorder={setTasks} className='task-list'>
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
            </Reorder.Group>
        </div>
    )
}

export default App
