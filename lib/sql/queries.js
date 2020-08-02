const connection = require("./connection");

const queries = {
    mainQuery: `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, role.department_id FROM employee INNER JOIN role ON role.id = employee.role_id`,
    selectAll: "SELECT * FROM ",

    sendQuery: function (query, stringIn, successFunction) {
        connection.query(query + stringIn, function (error, response) {
            if (error) error;
            successFunction(response, stringIn);
        });
    }
}

module.exports = queries;