import { useState } from 'react'

const Button = ({ name, state, setState }) => {
    return (
        <button className="mr-4 bg-blue-400 hover:bg-blue-500 border rounded-2xl padding-2 p-1"
            onClick={() => {setState(!state)}}>{name}</button>
    )
}

export function Login() {
    const [login, setLogin] = useState(false)
    const [register, setRegister] = useState(false)


    if (!login && !register) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className="flex items-center justify-center">Start by logging in or registering</h1>
                
                <div className="flex items-center justify-center mt-6">
                    <Button name='Login' state={login} setState={setLogin}/>
                    <Button name='Register' state={register} setState={setRegister}/>
                </div>
            </div>
        )
    }
    else if (login) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className='flex items-center justify-center'>LOGIN</h1>

                <input className="border"></input>
                <p>register</p>
                <input className="border"></input>

                <Button name='Back' state={login} setState={setLogin}/>
            </div>
        )
    }
    else if (register) {
        return (
            <div className="p-6 rounded-2xl shadow-lg w-80 bg-white mb-4">
                <h1 className="flex items-center justify-center">REGISTER</h1>
                <Button name='Back' state={register} setState={setRegister}/>
            </div>
        )
    }
}

/*


*/ 