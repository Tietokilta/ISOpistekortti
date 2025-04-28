import { useState } from 'react'
import loginService from '../services/login'

const Button = ({ name, state, setState }) => {
    return (
        <button className="mr-4 mt-4 bg-blue-400 hover:bg-blue-500 border rounded-2xl padding-2 p-1"
            onClick={() => {setState(!state)}}>{name}</button>
    )
}

const Login = ({ login, setLogin }) => {
    const [loginForm, setLoginForm] = useState(false)
    const [register, setRegister] = useState(false)
    const [fullname, setFullname] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')


    const handleFullnameChange = (event) => setFullname(event.target.value)
    const handleUsernameChange = (event) => setUsername(event.target.value)
    const handlePasswordChange = (event) => setPassword(event.target.value)
    const handlePassword2Change = (event) => setPassword2(event.target.value)

    const handleLogin = async () => {
        const response = await loginService.loginPost({ username: username, password: password })
        if (response.status === 200) {
            setLogin(!login)
        }
        //make a notification
    }

    const handleRegister = async () => {
        //check passwords match
        //check username is not taken
        //throtling?
        const checkPassword = () => {
            if (password === password2) {
                return true
            }
            else {
                console.log('passwords dont match')
                return false
            }
        }
        

        //const response = await registerService.registerPost
    }


    if (!loginForm && !register) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className="flex items-center justify-center font-bold">Kirjaudu sisään tai luo käyttäjä</h1>
                <h1 className="flex items-center justify-center font-bold">Login or create a user</h1>
                
                <div className="flex items-center justify-center mt-6">
                    <Button name='Login' state={loginForm} setState={setLoginForm}/>
                    <Button name='Create user' state={register} setState={setRegister}/>
                </div>
            </div>
        )
    }
    else if (loginForm) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white ">
                <h1 className='flex items-center justify-center font-bold'>LOGIN</h1>
                <div  className='flex items-center justify-center'>
                    <div>
                        <p className='font-mono'>Username</p>
                        <input className="border" onChange={handleUsernameChange}></input>
                        <p className='font-mono'>Password</p>
                        <input className="border" type='password' onChange={handlePasswordChange}></input>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <Button name='Back' state={loginForm} setState={setLoginForm}/>
                    <button className="mr-4 mt-4 bg-blue-400 hover:bg-blue-500 border rounded-2xl padding-2 p-1"
                        onClick={() => handleLogin()}>Ok</button>
                </div>
            </div>
        )
    }
    else if (register) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className="flex items-center justify-center font-bold">Create user</h1>
                <div className='flex items-center justify-center'>
                    <div>
                        <p className='font-mono'>Name</p>
                        <input className="border" onChange={handleFullnameChange}></input>
                        <p className='font-mono'>Username</p>
                        <input className="border" type='password' onChange={handleUsernameChange}></input>
                        <p className='font-mono'>Password</p>
                        <input className="border" type='password' onChange={handlePasswordChange}></input>
                        <p className='font-mono'>Password again</p>
                        <input className="border" type='password' onChange={handlePassword2Change}></input>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <Button name='Back' state={register} setState={setRegister}/>
                    <button className="mr-4 mt-4 bg-blue-400 hover:bg-blue-500 border rounded-2xl padding-2 p-1"
                        onClick={() => handleRegister()}>Ok</button>
                </div>
            </div>
        )
    }
}

export default Login