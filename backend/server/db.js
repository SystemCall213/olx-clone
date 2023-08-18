const Pool = require('pg').Pool

const pool = new Pool({
    user: 'postgres',
    password: 'gfhkfvtynd11',
    host: 'localhost',
    port: 5432,
    database: 'olx_clone'
})

module.exports = pool;