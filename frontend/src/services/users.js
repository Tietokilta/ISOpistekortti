import axios from "axios"

const registerPost = async ({ username, password, fullname }) => {
    const data = { username: username, password: password, name: fullname }
    const result = await axios.post('/api/signup', data)
    return result
}

export default { registerPost }
//check username is unique