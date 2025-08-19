import axios from 'axios'
import { data } from 'react-router-dom'
const baseUrl = '/api/admin'

const getTasks = async () => {
    console.log("getting tasks")
    try {
        const request = await axios.get(baseUrl + '/tasks')
        console.log("tasks", request.data)
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
        const request = await axios.put(baseUrl + '/tasks', task)
        console.log("tasks", request.data)
        return request
    }
    catch (error) {
        //console.log(error)
        return error.request?.status;
    }
}

export default { getTasks, updateTask }