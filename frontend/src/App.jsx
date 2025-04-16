import { useState, useEffect } from 'react'
import { Card }  from './components/Card';
import { Login } from './components/Login';
import taskService from './services/tasks'


function App() {
  const [tasks, setTasks] = useState([])
  const [login, setLogin] = useState(true)

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
    </div>
  )}
  }

export default App
