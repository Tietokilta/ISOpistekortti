const sendRequest = async ({ user_id, task_id, needs_admin_approval }) => {
    console.log("user: ", user_id, "requested task: ", task_id, needs_admin_approval)
}

export default { sendRequest }