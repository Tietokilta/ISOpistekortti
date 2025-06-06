import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate
} from 'react-router-dom'

import { Card }  from './components/Card';
import Login from './components/Login';
import { AdminFront } from './components/Adminfront'
import { Logout } from './components/Logout';
import taskService from './services/tasks'


const UserFront = ({ login, setLogin }) => {
  const [tasks, setTasks] = useState([])
  const [taskHook, setTaskHook] = useState(true)
  
  useEffect(() => {
    taskService.getAll()
      .then(result => {
        if (result.status === 200) {
          setTasks(result.data);  // assuming tasks are in result.data
        } 
        else if (result.status === 401) {
          console.log("moi")
          setLogin(!login)
        } 
        else {
          //if not ok show login form
          
          console.warn('Unexpected status:', result.status);
        }
      })
      .catch(error => {
        setLogin(!login)
      });
  }, [taskHook]);
  

  if(login) {
    return (
      <div
        className='flex flex-col items-center justify-center min-h-2/3 py-8'
      >
        <h1 className="text-3xl font-bold mb-4">ISOpistekortti 🤯💯</h1>
        <Login login={login} setLogin={setLogin} taskHook={taskHook} setTaskHook={setTaskHook}/>
      </div>
    )
  }
  else {

  return (
    <div
      className='flex flex-col items-center justify-center min-h-[120vh] py-8'
    >
      <h1 className="text-3xl font-bold">ISOpistekortti 🤯💯</h1>
      <div className="mt-6 space-y-4">
        {tasks.map(task => 
          <Card 
            key={task.id}
            title={task.title}
            description={task.description}
          />
        )}
      </div>
      <Logout setLogin={setLogin}/>
    </div>
  )}
}

const App = () => {
  const [login, setLogin] = useState(false) //don't show login on default, try to use cookies
  //check for authentication token

  return (
    <Router>
      <Routes>
        <Route path='/' element={<UserFront login={login} setLogin={setLogin}/>} />
        <Route path='/admin' element={<AdminFront setLogin={setLogin}/>} />
      </Routes>
    </Router>
  )
}

export default App
