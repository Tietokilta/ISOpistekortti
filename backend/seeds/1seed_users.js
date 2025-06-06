// seeds/seed_users.js

exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        // password: 'alicepass'
        { username: 'alice', 
          name: 'alice example',
          passwordHash: '$2b$12$wkPK9nMa9s4WSS2rKBKPSeBizr2b8HHrnlCLlF/Oq8DGO/5uEzKfy',
          is_admin: 'true',
        },

        // password: 'bobpass'
        { username: 'bob',
          name: 'bob example',
          passwordHash: '$2b$12$cZI4RrEpHRpxhwWuyzCiW.828YIQNiYxt6Tp877avTvDvGd0JweJu',
          is_admin: 'false',
        },

        // password: 'charliepass'
        { username: 'charlie',
          name: 'charlie example',
          passwordHash: '$2b$12$LAYlvBe7ketPiyMZyk72zeAJywqB5QYArTiXTn9pAUuK9.8xWiSeq',
          is_admin: 'false',
        }
      ]);
    });
};
