const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "abc121",

    database: "employees_db"
});

// establish connection to the server
connection.connect(function (error) {
    if (error) throw error;
    console.log("Connected : ", connection.threadId);
});

module.exports = connection;