# ISOpistekortti
How to get backend running (toimii ehk lmao) 

Go into ISOpistekortti/backend directory and run npm init to download all the needed node packages, you will need npm (node packet manager) so make sure you have it 

create .env file and add a port 
Run "psql -h localhost -U myuser -d mydatabase" in backend repo to get local database running
npx knex migrate:latest to migrate database
npx knex seed:run to fill database with mock data
Docker desktop needs to be running? emt lol