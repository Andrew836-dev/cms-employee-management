const connection = require("./connection");

const queries = {
    departmentJoinQuery: `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, role.department_id FROM employee INNER JOIN role ON role.id = employee.role_id`,
    selectAll: "SELECT * FROM ",
    selectManagers: "SELECT DISTINCT manager_id FROM employee",

    sendQuery: function (query, stringIn, successFunction) {
        connection.query(query + stringIn, function (error, response) {
            if (error) error;
            successFunction(response, stringIn);
        });
    }
}

module.exports = queries;