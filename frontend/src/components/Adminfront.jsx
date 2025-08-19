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
import adminService from "../services/admin.js"
import taskService from "../services/tasks.js"


function EditableField({ name, user, setUser, updateUserList, updatedParam, task, tasks, setTasks }) {
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
            setUser({ ...user, [updatedParam]: inputValue })
            setIsEditing(false);
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

const AcceptButton = ({ taskUser }) => {
    const handleSubmit = () => {
        //todo: update state of user list to have modified user in it
        // send a request to backend and if success change state of user in frontend
        console.log("accepted")
    };

    return (
        <div className="p-4">
            <div className="flex gap-2 items-center">

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Accept
                </button>
            </div>
        </div>
    );
}

const TaskCard = ({ task, tasks, setTasks }) => {
    const [isOpen, setIsOpen] = useState(false);

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
                </div>
            )}
        </div>
    );
};

const AcceptingCard = ({ taskUserFromList }) => {
    const [taskUser, setTaskUser] = useState({})

    return (
        <div className="bg-gray-400 p-4 rounded-2xl shadow-lg w-1/1 mb-4">
            <div
                className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4"
            >
                {"Alice, alicetest, do documentation"}
                <AcceptButton taskUser={taskUser} setTaskUser={setTaskUser} />
            </div>
        </div>
    )
}

const UserCard = ({ userFromList }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState({ user_id: "", username: "", name: "", is_admin: false })

    useEffect(() => {
        setUser({ user_id: "1", username: "alice", name: "alicetest", is_admin: false })
    }, [])

    return (
        <div className="bg-gray-400 p-4 rounded-2xl shadow-lg w-1/1 mb-4">
            <button
                className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4"
                onClick={() => setIsOpen(!isOpen)}
            >
                {"Alice, alicetest"}
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
                            setUser={setUser}
                            updateUserList={[]}
                            updatedParam={"username"}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <p>name: {user.name}</p>
                        <EditableField
                            name={"Edit"}
                            user={user}
                            setUser={setUser}
                            updateUserList={[]}
                            updatedParam={"name"}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        isAdmin: {user.is_admin ? "true" : "false"}
                        <EditableField
                            name={"Edit"}
                            user={user}
                            setUser={setUser}
                            updateUserList={[]}
                            updatedParam={"is_admin"}
                        />
                    </div>

                    <button
                        onClick={() => console.log("editing")}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Reset password
                    </button>

                    <p>Taskit näkyy sit tääl, suoritettu 1/2</p>
                    <li>task1: done</li>
                    <li>task2: not_done</li>
                </div>
            )}
        </div>
    )
}

const Container = ({ title, tasks, setTasks }) => {
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
                        <UserCard />
                    }
                    {title === 'Accept requested credits' &&
                        <AcceptingCard />
                    }
                </div>
            )}
        </div>
    );
}


export function AdminFront({ setLogin, login }) {
    const [tasks, setTasks] = useState([])

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
    }, []);
    console.log("taskit:", tasks)

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-white text-5xl mb-5">Admin Panel</h1>
            <Container title={"Users"} />
            <Container title={"Tasks"} tasks={tasks} setTasks={setTasks} />
            <Container title={"Accept requested credits"} />
            <AddTask
                tasks={tasks}
                setTasks={setTasks}
            />
            <Logout setLogin={setLogin} />
        </div>
    )
}
