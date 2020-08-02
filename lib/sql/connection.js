const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "abc124",

    database: "employees_db"
});

module.exports = connection;