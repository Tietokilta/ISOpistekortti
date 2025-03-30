import axios, { AxiosError } from 'axios'
const baseUrl = '/api/tasks'

const getAll = async () => {
    const request = await axios.get(baseUrl)
    return request.data
}

export default { getAll }
