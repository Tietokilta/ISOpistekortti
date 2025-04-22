import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate
} from 'react-router-dom'

import { Card }  from './components/Card';
import { Login } from './components/Login';
import { AdminFront } from './components/Adminfront'
import { Logout } from './components/Logout';
import taskService from './services/tasks'


const UserFront = ({ login, setLogin }) => {
  const [tasks, setTasks] = useState([])
  
  useEffect(() => {
    taskService.getAll().then(task =>
      setTasks( task )
    )
  }, [])
  

  if(login) {
    return (
      <div
        className='flex flex-col items-center justify-center min-h-2/3 py-8'
      >
        <h1 className="text-3xl font-bold mb-4">ISOpistekortti 🤯💯</h1>
        <Login/>
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
  const [login, setLogin] = useState(true)

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
