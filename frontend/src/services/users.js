import axios from "axios"

const registerPost = async ({ username, password, fullname }) => {
    const data = { username: username, password: password, name: fullname }
    try {
        const result = await axios.post('/api/signup', data)
        return result
    }
    catch (error) {
        return error.response;
    }
}

export default { registerPost }
//check username is unique