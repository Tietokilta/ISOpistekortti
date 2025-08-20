//see and modify all the tasks
//see and modify all the users
//see the requested credits
//modify the credits of a certain user

//task hook problem, why so many requests???
//be able to show all tasks in container
//be able to show all users (and modify)
//be able to show all requested tasks (and accept)
//reset password
//user mahdollisuus muokata omia tietoja
//tarvitaanko listat usereista (ja taskusereista) ja taskeista
//lisää tapa nähdä aiemmin hyväksytyt tehtävät

import { useState, useEffect } from 'react'
import { Logout } from "./Logout"
import { AddTask } from "./AddTask.jsx"
import { ResetPassword } from './ResetPassword.jsx'
import adminService from "../services/admin.js"
import taskService from "../services/tasks.js"
import tasks from '../services/tasks.js'
import admin from '../services/admin.js'



function EditableField({ name, user, setUsers, users, updatedParam, task, tasks, setTasks }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = async () => {
        //todo: update state of user list to have modified user in it
        // send a request to backend and if success change state of user in frontend
        console.log('New value:', inputValue);
        if (user) {
            console.log({ ...user, [updatedParam]: inputValue })

            const result = await adminService.updateUser({ ...user, [updatedParam]: inputValue })
            if (result.status == 200) {
                var filtered = users.filter(function (value) {
                    return value.id != user.id;
                })
                filtered.push({ ...user, [updatedParam]: inputValue })
                setUsers(filtered)
                setIsEditing(false);
            }
            else {
                console.log(result)
            }
        }
        if (task) {
            const result = await adminService.updateTask({ ...task, [updatedParam]: inputValue })
            if (result.status == 201) {
                var filtered = tasks.filter(function (value) {
                    return value.id != task.id;
                })
                filtered.push({ ...task, [updatedParam]: inputValue })
                setTasks(filtered.sort((a, b) => a.id - b.id))
                setIsEditing(false);
            }
            else {
                console.log(result)
            }
        }
    };


    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="p-4">
            {!isEditing ? (
                <div className="flex gap-2 items-center">

                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {name}
                    </button>
                </div>
            ) : (
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        placeholder="Enter new value"
                    />
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
}

function TogglableField({ task, tasks, setTasks, field }) {
    const handleSubmit = async () => {
        //todo: update state of user list to have modified user in it
        // send a request to backend and if success change state of user in frontend
        // console.log("toggling", field, task.needs_admin_approval)
        if (field === 'needs_admin_approval') {
            const result = await adminService.updateTask({ ...task, 'needs_admin_approval': !task.needs_admin_approval })
            if (result.status == 201) {
                var filtered = tasks.filter(function (value) {
                    return value.id != task.id;
                })
                filtered.push({ ...task, 'needs_admin_approval': !task.needs_admin_approval })
                setTasks(filtered.sort((a, b) => a.id - b.id))
            }
            else {
                console.log(result)
            }
        }
    };

    return (
        <div className="p-4">
            <div className="flex gap-2 items-center">

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    toggle
                </button>
            </div>
        </div>
    );
}

const AcceptButton = ({ user, task_users, setTask_users }) => {
    const handleSubmit = async (bool) => {
        const result = await adminService.handleRequestedTask(bool, user)
        console.log(user)
        if (result.status == 200) {
            var filtered = task_users.filter(function (value) {
                return value.task_user_id != user.task_user_id;
            })
            setTask_users(filtered.sort((a, b) => a.task_user_id - b.task_user_id))
        }
        else {
            console.log(result)
        }

    };

    return (
        <div className="p-4">
            <div className="flex gap-2 items-center">

                <button
                    onClick={() => handleSubmit(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Accept
                </button>

                <button
                    onClick={() => handleSubmit(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                    Reject
                </button>
            </div>
        </div>
    );
}

const TaskCard = ({ task, tasks, setTasks }) => {
    const [isOpen, setIsOpen] = useState(false);

    const deleteTask = async (task) => {
        const result = await adminService.deleteTask(task)
        console.log(result)
        if (result.status == 200) {
            var filtered = tasks.filter(function (value) {
                return value.id != task.id;
            })
            setTasks(filtered.sort((a, b) => a.id - b.id))
        }
        else {
            console.log(result)
        }
    }

    return (
        <div className="bg-gray-400 p-4 rounded-2xl shadow-lg w-full mb-4">
            <button
                className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                {task.title}
                <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="p-4 text-gray-700 space-y-3">
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Title:</p>
                        <p>{task.title}</p>
                        <EditableField
                            name={"Edit"}
                            task={task}
                            tasks={tasks}
                            setTasks={setTasks}
                            updatedParam={"title"}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Description:</p>
                        <p>{task.description}</p>
                        <EditableField
                            name={"Edit"}
                            task={task}
                            tasks={tasks}
                            setTasks={setTasks}
                            updatedParam={"description"}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="font-medium">Admin Approved:</p>
                        <p>{task.needs_admin_approval ? "true" : "false"}</p>
                        <TogglableField
                            task={task}
                            tasks={tasks}
                            setTasks={setTasks}
                            field={"needs_admin_approval"}
                        />
                    </div>
                    <div>
                        <button
                            onClick={() => deleteTask(task)}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AcceptingCard = ({ user, task_users, setTask_users }) => {

    return (
        <div className="bg-gray-400 p-1 rounded-2xl shadow-lg w-1/1 mb-4">
            <div
                className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4"
            >
                {`${user.username}, ${user.task_title}`}
                <AcceptButton user={user} task_users={task_users} setTask_users={setTask_users} />
            </div>
        </div>
    )
}

const UserCard = ({ user, users, setUsers, }) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-gray-400 p-4 rounded-2xl shadow-lg w-1/1 mb-4">
            <button
                className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                {user.name + ", " + user.username}
                <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                        <p>username: {user.username}</p>
                        <EditableField
                            name={"Edit"}
                            user={user}
                            users={users}
                            setUsers={setUsers}
                            updatedParam={"username"}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <p>name: {user.name}</p>
                        <EditableField
                            name={"Edit"}
                            user={user}
                            users={users}
                            setUsers={setUsers}
                            updatedParam={"name"}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        isAdmin: {user.is_admin ? "true" : "false"}
                        <EditableField
                            name={"Edit"}
                            user={user}
                            users={users}
                            setUsers={setUsers}
                            updatedParam={"is_admin"}
                        />
                    </div>
                    <ResetPassword id={user.id} />

                    <p><b>Has completed {user.completed_tasks} task(s)</b></p>
                    <li>task1: done</li>
                    <li>task2: not_done</li>
                </div>
            )}
        </div>
    )
}

const Container = ({ title, tasks, setTasks, users, setUsers, task_users, setTask_users }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="p-6 rounded-2xl shadow-lg w-150 bg-white mb-4">
            <button
                className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4 border-b"
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                // add a for loop here
                <div className="p-4 text-gray-600">
                    {title === 'Tasks' &&
                        <>
                            {tasks.map((task, index) => (
                                <TaskCard
                                    key={index}
                                    task={task}
                                    tasks={tasks}
                                    setTasks={setTasks}
                                />
                            ))}
                        </>
                    }
                    {title === 'Users' &&
                        <>
                            {users.map((user, index) => (
                                <UserCard
                                    key={index}
                                    user={user}
                                    users={users}
                                    setUsers={setUsers}
                                />
                            ))}
                        </>
                    }
                    {title === 'Accept requested credits' &&
                        <>
                            {task_users.map((user, index) => (
                                <AcceptingCard
                                    key={index}
                                    user={user}
                                    task_users={task_users}
                                    setTask_users={setTask_users}
                                />
                            ))}
                        </>
                    }
                </div>
            )}
        </div>
    );
}


export function AdminFront({ setLogin }) {
    const [tasks, setTasks] = useState([])
    const [users, setUsers] = useState([])
    const [task_users, setTask_users] = useState([])

    useEffect(() => {
        adminService.getTasks()
            .then(result => {
                if (result.status === 200) {
                    setTasks(result.data.tasks.sort((a, b) => a.id - b.id))
                }
            })
            .catch(error => {
                console.log(error)
            })
        adminService.getUsers()
            .then(result => {
                if (result.status === 200) {
                    //console.log("users:", result.data.users)
                    setUsers(result.data.users.sort((a, b) => a.completed_tasks - b.completed_tasks))
                }
            })
            .catch(error => {
                console.log(error)
            })
        adminService.getTaskUsers()
            .then(result => {
                if (result.status === 200) {
                    console.log(result.data.requested_tasks)
                    setTask_users(result.data.requested_tasks)
                }
            })
            .catch(error => {
                console.log(error)
            })
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-white text-5xl mb-5">Admin Panel</h1>
            <Container title={"Users"} users={users} setUsers={setUsers} />
            <Container title={"Tasks"} tasks={tasks} setTasks={setTasks} />
            <Container title={"Accept requested credits"} task_users={task_users} setTask_users={setTask_users} />
            <AddTask
                tasks={tasks}
                setTasks={setTasks}
            />
            <Logout setLogin={setLogin} />
        </div>
    )
}
