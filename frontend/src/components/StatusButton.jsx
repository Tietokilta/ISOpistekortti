import userRequest from "../services/userRequest";

const StatusButton = ({ status, type }) => {
  console.log(status)
  const handleRequest = async () => {
    userRequest.sendRequest({ "task_id": 1, "user_id": 2, "needs_admin_approval": type})
  }
  return (
    <div className="mt-4">
      <p> <strong>Current status of task: </strong> {"add stuff here"} </p>
      <button
        type='button'
        onClick={handleRequest}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95"
      >
        <p>{type ? "Request" : "Complete"}</p>
      </button>
    </div>
  );
}

export { StatusButton }
