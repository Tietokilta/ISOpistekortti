import axios from 'axios'
const baseUrl = '/api/login'

const loginPost = async ({ username, password }) => {
    const data = { username: username, password: password }
    try {
        const request = await axios.post(baseUrl, data)
        return request
    }
    catch (error) {
        //console.log(error)
        return error.request?.status;
    }
}

const checkToken = async () => {
    try {
        const request = await axios.get('/api/users/user_info')
        //console.log("checkToken", request.data)
        return request
        }
    catch (error) {
        //console.log(error)
        return error.request?.status;
    }
}

export default { loginPost, checkToken }