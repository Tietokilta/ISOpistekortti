import axios from 'axios'
const baseUrl = '/api/login'

const loginPost = async ({ username, password }) => {
    const data = { username: username, password: password }
    const request = await axios.post(baseUrl, data)
    return request
}

export default { loginPost }