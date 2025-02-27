exports.seed = async function(knex) {
  // Get all users and tasks from the database
  const users = await knex('users').select('id'); // Fetch the IDs of all users
  const tasks = await knex('tasks').select('id'); // Fetch the IDs of all tasks

  // Insert relationships into the task_user table
  const taskUserData = [];

  // Example: Assigning random users to tasks (you can customize this logic)

  taskUserData.push({ task_id: tasks[0].id, user_id: users[0].id });
  taskUserData.push({ task_id: tasks[1].id, user_id: users[0].id });
  taskUserData.push({ task_id: tasks[2].id, user_id: users[1].id });
  taskUserData.push({ task_id: tasks[2].id, user_id: users[2].id });

  // Insert data into the task_user table
  return knex('task_user').insert(taskUserData);
};
