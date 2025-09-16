import { useState } from 'react'
import loginService from '../services/login'
import userService from '../services/users'

const Button = ({ name, callable, submit = false }) => {
    return (
        <button type={submit ? "submit" : "button"}
            className="mr-4 mt-4 bg-blue-400 hover:bg-blue-500 border rounded-2xl padding-2 p-1"
            onClick={callable}>{name}</button>
    )
}

const Login = ({ login, setLogin, setUser }) => {
    const [loginForm, setLoginForm] = useState(false)
    const [register, setRegister] = useState(false)
    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [notification, setNotification] = useState('')


    const handleFullnameChange = (event) => setFullname(event.target.value)
    const handleUsernameChange = (event) => setUsername(event.target.value)
    const handlePasswordChange = (event) => setPassword(event.target.value)
    const handlePassword2Change = (event) => setPassword2(event.target.value)

    const showTemporaryMessage = (msg, duration = 3000) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), duration);
    };

    const handleLogin = async () => {
        const response = await loginService.loginPost({ username: username, password: password })
        if (response.status === 200) {
            const data = response.data 
            setLogin(!login)
            setUser({user_id : data.user_id, username : data.username, name : data.name, is_admin: data.is_admin})
        }
        else {
            showTemporaryMessage('Invalid username or password, forgot password, please contact ISOvastaava')
        }
    }

    const handleRegister = async () => {
        //throtling?
        const checkPassword = () => {
            if (password === password2) {
                return true
            }
            else {
                return false
            }
        }

        if (checkPassword()) {
            const response = await userService.registerPost({ username, password, fullname })
            //console.log(response)
            if (response.status === 201) {
                setLogin(!login)
            }
            else if (response.status === 400) {
                //console.log(response.data.message)
                showTemporaryMessage(response.data.message)
            }
            else if (response.status === 409)
                showTemporaryMessage('Username already taken')
            else {
                showTemporaryMessage('Error in creating user')
            }
        }
        else {
            showTemporaryMessage('Passwords need to match')
        }
    }


    if (!loginForm && !register) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className="flex items-center justify-center font-bold">Kirjaudu sisään tai luo käyttäjä</h1>
                <h1 className="flex items-center justify-center font-bold">Login or create a user</h1>

                <div className="flex items-center justify-center mt-6">
                    <Button name='Login' callable={() => setLoginForm(true)} />
                    <Button name='Create user' callable={() => setRegister(true)} />
                </div>
            </div>
        )
    }
    else if (loginForm) {
        //console.log(notification)
        return (
            <form action={handleLogin} className="p-6 rounded-2xl shadow-lg w-80 bg-white ">
                <h1 className='flex items-center justify-center font-bold'>LOGIN</h1>
                <div className='flex items-center justify-center'>
                    <div>
                        <p className='font-mono'>Username</p>
                        <input className="border" type='text' onChange={handleUsernameChange}></input>
                        <p className='font-mono'>Password</p>
                        <input className="border" type='password' onChange={handlePasswordChange}></input>
                        <p> {notification} </p>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <Button name="Back" callable={() => setLoginForm(false)} />
                    <Button name="Ok" submit={true} />
                </div>
            </form>
        )
    }
    else if (register) {
        return (
            <form action={handleRegister} className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className="flex items-center justify-center font-bold">Create user</h1>
                <div className='flex items-center justify-center'>
                    <div>
                        <p className='font-mono'>Name</p>
                        <input className="border" onChange={handleFullnameChange}></input>
                        <p className='font-mono'>Username</p>
                        <input className="border" type='text' onChange={handleUsernameChange}></input>
                        <p className='font-mono'>Password</p>
                        <input className="border" type='password' onChange={handlePasswordChange}></input>
                        <p className='font-mono'>Password again</p>
                        <input className="border" type='password' onChange={handlePassword2Change}></input>
                        <p> {notification} </p>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <Button name="Back" callable={() => setRegister(false)} />
                    <Button name="Ok" submit={true} />
                </div>
            </form>
        )
    }
}

export default Login
