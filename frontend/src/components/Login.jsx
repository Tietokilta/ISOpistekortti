import { useState } from 'react'
import loginService from '../services/login'

const Button = ({ name, state, setState }) => {
    return (
        <button className="mr-4 mt-4 bg-blue-400 hover:bg-blue-500 border rounded-2xl padding-2 p-1"
            onClick={() => {setState(!state)}}>{name}</button>
    )
}

export function Login() {
    const [login, setLogin] = useState(false)
    const [register, setRegister] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleLogin = () => {
        console.log(username)
        console.log(password)
        loginService.loginPost({ username: username, password: password })
        //make a notification
    }

    if (!login && !register) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className="flex items-center justify-center font-bold">Kirjaudu sisään tai luo käyttäjä</h1>
                <h1 className="flex items-center justify-center font-bold">Login or create a user</h1>
                
                <div className="flex items-center justify-center mt-6">
                    <Button name='Login' state={login} setState={setLogin}/>
                    <Button name='Create user' state={register} setState={setRegister}/>
                </div>
            </div>
        )
    }
    else if (login) {
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
                    <Button name='Back' state={login} setState={setLogin}/>
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
                        <input className="border"></input>
                        <p className='font-mono'>Username</p>
                        <input className="border" type='password'></input>
                        <p className='font-mono'>Password</p>
                        <input className="border" type='password'></input>
                        <p className='font-mono'>Password again</p>
                        <input className="border" type='password'></input>
                    </div>
                </div>
                <div className='flex items-center justify-center'>
                    <Button name='Back' state={register} setState={setRegister}/>
                    <Button name='Ok'/>
                </div>
            </div>
        )
    }
}
