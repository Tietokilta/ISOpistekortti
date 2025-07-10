import taskService from "../services/tasks.js";
import { useEffect, useState } from "react";

const StatusButton = ({ task, tasks, setTasks }) => {
  const [class_name, setClass_name] = useState(""); // no initial value
  const [isDisabled, setIsDisabled] = useState(false);

  // Set style of button and is it disabled initially, and every time tasks state is modified
  useEffect(() => {
    setClass_name(taskService.getButton(task))
    setIsDisabled(task.status === 'rejected')
  }, [tasks]);

  const handleRequest = async () => {
    //this is just for logging 
    //console.log(task)
    const new_status = taskService.getNewTaskStatus(task.status, task.needs_admin_approval)

    const status = await taskService.postUserTask({ "task_id": task.task_id, "new_task_status": new_status })
    if (status === 200) {

      var filtered = tasks.filter(function (value) {
        return value.task_id != task.task_id;
      })
      filtered.push({ ...task, status: new_status })
      setTasks(filtered.sort((a, b) => a.task_id - b.task_id))
    }
    else {
      console.log("updating task status failed")
    }
  }

  const buttonLabel = {
    done: "Done",
    not_done: "Not done",
    requesting: "Requesting...",
    rejected: "Rejected",
  }
  return (
    <div className="mt-4">
      <p> <strong>Current status of task: </strong></p>
      <button
        type='button'
        onClick={handleRequest}
        className={class_name}
        disabled={isDisabled}
      >
        <p>{buttonLabel[task.status]}</p>
      </button>
    </div >
  );
}

export { StatusButton }
