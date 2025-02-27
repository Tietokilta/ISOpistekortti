// seeds/seed_tasks.js

exports.seed = function(knex) {
  return knex('tasks').del()
    .then(function () {
      return knex('tasks').insert([
        { title: 'Complete project proposal', description: 'Finish the proposal for the new project.' },
        { title: 'Write documentation', description: 'Write detailed documentation for the new feature.' },
        { title: 'Review code', description: 'Review the PR for the latest release.' }
      ]);
    });
};
