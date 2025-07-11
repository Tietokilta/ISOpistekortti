import axios, { AxiosError } from 'axios'
import { data } from 'react-router-dom'
const baseUrl = '/api/tasks'
const taskUserBase = '/api/tasks/task_user'

const getAll = async () => {
    const request = await axios.get(baseUrl)
    if (request.status === 401) {
        console.log("not authorized")
    }
    return request
}

const getUserTasks = async () => {
    const request = await axios.get(taskUserBase)
    if (request.status === 401) {
        console.log("not authorized")
    }
    return request
}

const postUserTask = async (data) => {
    console.log(data)
    const request = await axios.post(taskUserBase, data)
    return request.status
}

const getNewTaskStatus = (currentStatus, admin_approval) => {
    const admin = {
        done: "not_done",
        not_done: "requesting",
        requesting: "not_done",
        rejected: "requesting",
    }

    const nonAdmin = {
        done: "not_done",
        not_done: "done",
    }
    if (admin_approval) {
        return admin[currentStatus]
    }
    else {
        return nonAdmin[currentStatus]
    }
}

const getButton = (task) => {
    switch (task.status) {
        case 'done':
            return `bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95`
        case 'not_done':
            return `bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95`
        case 'requesting':
            return `bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95`
        case 'rejected':
            return `bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95`
        default: console.log("Unknown status")
    }
}

export default { getUserTasks, postUserTask, getNewTaskStatus, getButton, getAll }
