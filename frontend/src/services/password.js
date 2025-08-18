import axios from 'axios'
const baseUrl = '/api/users/password'

const changePassword = async (newPassword) => {
    const request = await axios.post(baseUrl, { password: newPassword })
    return request
}

export default { changePassword }