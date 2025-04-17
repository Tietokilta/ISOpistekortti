import axios from 'axios'
const baseUrl = '/api/login'

const loginPost = async ({ username, password }) => {
    console.log(username)
    console.log(password)

    const data = { username: username, password: password }
    const request = await axios.post(baseUrl, data)
    return request.data
}

const logOut = async () => {

}

export default { loginPost }