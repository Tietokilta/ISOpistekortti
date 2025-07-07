# ISOpistekortti
### How to get the backend running for development
Pre-requisites [Node.js v22](https://nodejs.org/en/download) and [Docker](https://docs.docker.com/get-started/get-docker/)

```bash
# setup .env file
cp .env.example .env

# navigate to backend directory
cd backend

# install dependencies
npm install

# Create separate secrets for all secrets in .env, with for example
openssl rand -hex 32

# start db
npm run db:start

# migrate schemas
npm run db:migrate

# seed database
npm run db:seed

# run dev server
npm run dev
```

Seeding the database creates the following dummy users that can be logged into with the given username and password
```
alice:      'alicepass'     (admin)
bob:        'bobpass'       (non-admin)
charlie:    'charliepass'   (non-admin)
```

To open a psql session into the database, run
```bash
docker compose exec postgres psql -h localhost -U myuser -d mydatabase
```
