import axios from 'axios'
const baseUrl = '/api/login'

const loginPost = async ({ username, password }) => {
    const data = { username: username, password: password }
    try {
        const request = await axios.post(baseUrl, data)
    }
    catch (error) {
        return error.request?.status;
    }
}

export default { loginPost }