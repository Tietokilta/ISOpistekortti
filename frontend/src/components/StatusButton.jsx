import taskService from "../services/tasks.js";

const StatusButton = ({ task, tasks, setTasks }) => {
  const handleRequest = async () => {
    //this is just for logging 
    //console.log(task)
    const new_status = taskService.getNewTaskStatus(task.status, task.needs_admin_approval)
    //console.log(new_status)
    //make a function to get new status

    const status = await taskService.postUserTask({ "task_id": task.task_id, "new_task_status": new_status })
    if (status === 200) {

      var filtered = tasks.filter(function (value) {
        return value.task_id != task.task_id;
      })
      

      filtered.push({...task, status: new_status})
      setTasks(filtered.sort((a, b) => a.task_id - b.task_id))
    }
    else {
      console.log("updating task status failed")
    }
  }

  // add logic to change color of button based on the status

  return (
    <div className="mt-4">
      <p> <strong>Current status of task: </strong> {task.status} </p>
      <button
        type='button'
        onClick={handleRequest}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95"
      >
        <p>{task.type ? "Request" : "Complete"}</p>
      </button>
    </div>
  );
}

export { StatusButton }
