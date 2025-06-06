const StatusButton = ({ status }) => {
  return (
    <div className="mt-4">
      <p> <strong>Current status of task: </strong> {status} </p>
      <button
        type='button'
        onClick={console.log("moi")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95"
      >
        <p>Complete / request</p>
      </button>
    </div>
  );
}

export { StatusButton }
