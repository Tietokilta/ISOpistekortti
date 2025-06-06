import axios, { AxiosError } from 'axios'
const baseUrl = '/api/tasks'

const getAll = async () => {
    const request = await axios.get(baseUrl)
    if (request.status === 401) {
        console.log("not authorized")
    }
    return request
}

export default { getAll }
