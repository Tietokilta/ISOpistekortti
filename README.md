# ISOpistekortti

## Contributing
The repo's `main` branch is protected and contributions should be made to
other branches, preferably to feature branches, and PR'ed to `staging`.

If a change adds new npm packages (ie. `package-lock.json` is changed in `/backend` 
or `/frontend`), this will invalidate the `npmDepsHash` used to build the Nix derivations.
In this case, update the hash for the respective derivation in `package.nix`.
If you don't have Nix installed, there will be a check running in each PR which should
show errors if the hash is wrong (including what the hash should be).


## How to get the backend running for development
Pre-requisites: [Node.js](https://nodejs.org/en/download) (tested on 18 and 22) and [Docker](https://docs.docker.com/get-started/get-docker/)

```bash
# setup .env file
cp .env.example .env

# Create separate secrets for the secrets in .env, with for example
openssl rand -hex 32

# navigate to backend directory
cd backend

# install dependencies
npm install

# start db
npm run db:start

# run dev server, database migrations will run automatically
npm run dev

# seed database
npm run db:seed

# if you wish to reset the database
npm run db:reset
```
The backend should now be running on http://localhost:3000.

Seeding the database creates the following dummy users that can be logged into with the given username and password
```
alice:      'alicepass'     (admin)
bob:        'bobpass'       (non-admin)
charlie:    'charliepass'   (non-admin)
```

To open a psql session into the database, run the following command in `/backend`.
The argument after `-U` should match `DB_USER` in `.env`, and the argument after `-d`
should match `DB_DATABASE` in `.env`.
```bash
# make sure database is running, if not, run
npm run db:start

# start a psql session in db
docker compose exec postgres psql -h localhost -U myusername -d isopistekortti
```

## How to get the frontend running for development
Pre-requisites: [Node.js](https://nodejs.org/en/download) (tested on 18 and 22)  
Setup .env file as shown in the [backend section](#how-to-get-the-backend-running-for-development), then:
```bash
# navigate to frontend directory
cd frontend

# install dependencies
npm install

# run frontend server
npm run dev
```

The site should now be running locally on http://localhost:5173


## For Nix users

### Devshell
This project contains a simple `flake.nix` file which exposes a simple devShell output,
which can be entered with `nix develop`, or by using `(nix-)direnv` and a `.envrc` file
at the project root:
```bash
dotenv # if you want to also load variables from .env into the environment
use flake
```

### Building the project with Nix
The `flake.nix` also exposes two packages, `isopistekortti`, and `docker`.
`isopistekortti` is just the project itself (frontend + backend) as one derivation,
which has an executable `isopistekortti` in `$out/bin`. This package can be built with
`nix build .#isopistekortti`.

`docker` is a layered Docker image that runs the aforementioned `isopistekortti`
executable. This package is also the image that gets built and published by the CI/CD
pipeline, and is used in production. This package can be built with `nix build .#docker`
