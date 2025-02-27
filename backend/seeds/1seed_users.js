// seeds/seed_users.js

exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        { username: 'alice', name: 'alice example', passwordHash: 'hashedpassword123' },
        { username: 'bob', name: 'bob example', passwordHash: 'hashedpassword456' },
        { username: 'charlie', name: 'charlie example', passwordHash: 'hashedpassword789' }
      ]);
    });
};
