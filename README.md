# ISOpistekortti
### How to get the backend running for development
Pre-requisites [Node.js v22](https://nodejs.org/en/download) and [Docker](https://docs.docker.com/get-started/get-docker/)

```bash
# navigate to backend directory
cd backend

# install dependencies
npm install

# setup .env file
cp .env.example .env

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

To open a psql session into the database, run
```bash
docker compose exec postgres psql -h localhost -U myuser -d mydatabase
```
