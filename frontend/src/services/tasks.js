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
    if(admin_approval) {
        return admin[currentStatus]
    }
    else{
        return nonAdmin[currentStatus]
    }
}

export default { getUserTasks, getAll, postUserTask, getNewTaskStatus }
