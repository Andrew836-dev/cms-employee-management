const connection = require("./lib/config/connection");
const orm = require("./lib/config/orm");
const mainMenu = require("./cms");
// establish connection to the server
connection.connect(function (error) {
    if (error) throw error;
    console.log("Connected : ", connection.threadId);
    mainMenu();
});