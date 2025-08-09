import axios from 'axios'
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

export default { getTasks }