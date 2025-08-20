import axios from 'axios'
import { use } from 'react'
const baseUrl = '/api/admin'

const getTasks = async () => {
    //console.log("getting tasks")
    try {
        const request = await axios.get(baseUrl + '/tasks')
        //console.log("tasks", request.data)
        return request
    }
    catch (error) {
        //console.log(error)
        return error.request?.status;
    }
}

const updateTask = async (task) => {
    const data = { ...task, task_id: task.id }
    try {
        const request = await axios.put(baseUrl + '/tasks', data)
        //console.log("tasks", request.data)
        return request
    }
    catch (error) {
        //console.log(error)
        return error.request?.status;
    }
}

const createTask = async (task) => {
    console.log(task)
    try {
        const request = await axios.post(baseUrl + '/tasks', task)
        //console.log(request)
        return request
    }
    catch (error) {
        console.log(error)
        return error.request?.status;
    }
}

const deleteTask = async (task) => {
    try {
        console.log(task)
        const request = await axios.delete(baseUrl + '/tasks/' + task.id)
        return request
    }
    catch (error) {
        console.log(error)
        return error.request?.status;
    }
}

const getUsers = async () => {
    try {
        const request = await axios.get(baseUrl + '/users')
        return request
    }
    catch (error) {
        return error.request?.status;
    }
}

const updateUser = async (user) => {
    const data = { ...user, user_id: user.id, is_admin: user.is_admin === "true" }
    try {
        const request = await axios.put(baseUrl + '/users/' + user.id, data)
        console.log("users", request.data)
        return request
    }
    catch (error) {
        //console.log(error)
        return error.request?.status;
    }
}

const resetPassword = async (id, password) => {
    const data = { password: password }
    const request = await axios.post(baseUrl + '/users/' + id + '/password', data)
    return request
}

const getTaskUsers = async () => {
    try {
        const request = await axios.get(baseUrl + '/requested_tasks')
        return request
    }
    catch (error) {
        return error.request?.status;
    }
}

const handleRequestedTask = async (accepted, user) => {
    try {
        if (accepted) {
            const request = await axios.patch(baseUrl + '/task_user/' + user.task_user_id, { new_task_status: "done" })
            return request
        }
        else {
            const request = await axios.patch(baseUrl + '/task_user/' + user.task_user_id, { new_task_status: "rejected" })
            return request
        }
        
        
    }
    catch (error) {
        return error.request?.status;
    }
}

export default { getTasks, updateTask, createTask, deleteTask, getUsers, updateUser, resetPassword, getTaskUsers, handleRequestedTask }
