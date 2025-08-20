import { useState } from "react"
import { StatusButton } from './StatusButton.jsx'


export function Card({ task, tasks, setTasks }) {
  const [isOpen, setIsOpen] = useState(false);
  //console.log(task)

  //different buttons for different types of tasks
  return (
    <div
      className={`p-6 rounded-2xl shadow-lg w-80 mb-4 ${task.status === "done" ? "bg-green-400" : "bg-white"
        }`}
    >
      <button
        className="w-full text-left flex justify-between items-center font-bold text-gray-900 text-lg p-4 border-b"
        onClick={() => setIsOpen(!isOpen)}
      >
        {task.title}
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-4 text-gray-600">
          {task.description}
          <StatusButton
            task={task}
            tasks={tasks}
            setTasks={setTasks}
          />

        </div>
      )}
    </div>
  );
}



