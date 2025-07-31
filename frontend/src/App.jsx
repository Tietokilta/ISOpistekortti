import { useState, useEffect } from 'react'

import { Card } from './components/Card';
import Login from './components/Login';
import { AdminFront } from './components/Adminfront'
import { Logout } from './components/Logout';
import taskService from './services/tasks'
import loginService from './services/login';
import { data } from 'react-router-dom';



const UserFront = ({ login, setLogin, user }) => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // taskService.getAll()
    taskService.getUserTasks()
      .then(result => {
        if (result.status === 200) {
          setTasks(result.data);  // assuming tasks are in result.data
        }
        else if (result.status === 401) {
          setLogin(!login)
        }
        else {
          //if not ok show login form

          console.warn('Unexpected status:', result.status);
        }
      })
      .catch(error => {
        console.warn(error)
        setLogin(!login)
      });
  }, []);

  return (
    <div
      className='flex flex-col items-center justify-center min-h-[120vh] py-8'
    >
      <h1 className="text-3xl font-bold">ISOpistekortti 🤯💯</h1>
      <div className="mt-6 space-y-4">
        {tasks.map(task =>
          <Card
            task={task}
            tasks={tasks}
            setTasks={setTasks}
          />
        )}
      </div>
      <Logout setLogin={setLogin} />
    </div>
  )
}

// Kun appi käynnistyy täytyisi olla tapa tarkistaa onko käyttäjällä tokenia, jos on niin palautetaan kyseinen käyttäjä
// App
// - login
//   - user
//   - admin

const App = () => {
  const [login, setLogin] = useState(true) //don't show login on default, try to use cookies
  const [user, setUser] = useState({ user_id: "", username: "", name: "", is_admin: false })

  //check for authentication token and set user state if it is available
  useEffect(() => {
    // var result, data = 
    loginService.checkToken()
      .then(result => {
        //console.log("result: ", result)
        if (result.status === 200) {
          //console.log(result.data)
          setUser(result.data)
          setLogin(false)
        }
      })
      .catch(error => {
        console.warn(error)
      });
  }, [])

  //console.log("login state: ", login, user)
  if (login) {
    return (
      <div
        className='flex flex-col items-center justify-center min-h-2/3 py-8'
      >
        <h1 className="text-3xl font-bold mb-4">ISOpistekortti 🤯💯</h1>
        <Login login={login} setLogin={setLogin} setUser={setUser} />
      </div>
    )
  }
  else if (!login && user.is_admin) {
    return (
      <AdminFront login={login} setLogin={setLogin} />
    )
  }
  else {
    return (
      <UserFront login={login} setLogin={setLogin} user={user} setUser={setUser}/>
    )
  }

}

export default App
