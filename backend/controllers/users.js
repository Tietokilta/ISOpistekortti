const userRouter = require('express').Router()
require('../app');
const bcrypt = require('bcrypt')
const pool = require("../db");
const consts = require('./auth/consts');

async function testConnection() {
    const result = await pool.query("SELECT NOW()");
    console.log("Database Connected:", result.rows);
  }
testConnection();

userRouter.get('/', async (request, response) => {
    const result = await pool.query('SELECT * FROM users')
    // console.log(result.rows)
    response.json(result.rows)
  })

userRouter.post('/', async (request, response) => {
    console.log('request data: ', request.body.password)

    /*nää on mun omii testailuja, mut phashil saa ton pasword hashing minkä voi laittaa sit tableen    
    tälleen laitoin insert into komennon jostain syystä passwordHash piti laittaa heittomerkkeihin
    ja toi hash on vaan "salasana"

    INSERT INTO users (username, name, "passwordHash")
    VALUES (
    'otso',
    'Otso',
    '$2b$10$Hc5KsW.woToOQ7cesKVBb.j.25UnN9WoRFLa.zCBDYiGMiIiqCe2K'
    );

    */
    const phash = await bcrypt.hash(request.body.password, consts.SALT_ROUNDS)
    console.log(phash)
    response.status(204).end()
})

module.exports = userRouter
