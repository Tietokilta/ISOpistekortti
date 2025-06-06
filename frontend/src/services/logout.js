import axios from 'axios'
const baseUrl = '/api/logout'

const logoutPost = async () => {
    const request = await axios.post(baseUrl, {})
    console.log(request)
    return request
}

export default { logoutPost }