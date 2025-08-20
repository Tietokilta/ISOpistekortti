import { useState, useEffect } from 'react'

import { Card } from './components/Card';
import Login from './components/Login';
import { AdminFront } from './components/Adminfront'
import { Logout } from './components/Logout';
import taskService from './services/tasks'
import loginService from './services/login';
import { data } from 'react-router-dom';



const UserFront = ({ login, setLogin }) => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    // taskService.getAll()
    taskService.getUserTasks()
      .then(result => {
        if (result.status === 200) {
          setTasks(result.data.sort((a, b) => a.task_id - b.task_id));  // assuming tasks are in result.data
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
      className='flex flex-col items-center justify-center py-8'
    >
      <h1 className="text-3xl font-bold">ISOpistekortti 🤯💯</h1>
      <div className="mt-6 space-y-4">
        {tasks.map((task, index) =>
          <Card
            key={index}
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
        className='flex flex-col items-center py-8'
      >
        <h1 className="text-3xl font-bold mb-4">ISOpistekortti 🤯💯</h1>
        <Login login={login} setLogin={setLogin} setUser={setUser} />
      </div>
    )
  }
  else if (!login && user.is_admin) {
    return (
      <div
        className='flex flex-col items-center py-8'
      >
        <AdminFront login={login} setLogin={setLogin} />
      </div>
    )
  }
  else {
    return (
      <div className="flex flex-col min-h-screen">
      <div
        className='flex-grow flex flex-col items-center justify-start py-4 px-2'
      >
      <UserFront login={login} setLogin={setLogin} user={user} setUser={setUser}/>
      </div>
      </div>
    )
  }

}

export default App
