const mysql = require('mysql')

const database = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Lxp@1007',
    database: 'my_db_01'
})

module.exports = database