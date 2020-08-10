const connection = require("./connection");

const namesForList = 'CONCAT(employee.first_name, " ", employee.last_name) AS name'
// const selectManagers = "SELECT DISTINCT manager_id FROM employee";

const sendQuery = function(query, object = []) {
    // console.log(query, object);
    return connection.query(query, object);
}

const queries = {
    closeConnection: function() {
        connection.end();
    },
    selectAsName: function (column, table) {
        let query = "SELECT ?? AS name FROM ??";
        return sendQuery(query, [column, table]);
    },
    selectDistinct: function (column, table) {
        let query = "SELECT DISTINCT ?? FROM ??";
        return sendQuery(query, [column, table]);
    },
    selectWhere: function (columns, tables, firstCondition, secondCondition) {
        let query = "SELECT ?? FROM ?? WHERE ?? = ?";
        return sendQuery(query, [columns, tables, firstCondition, secondCondition]);
    },
    create: function (table, object) {
        let query = `INSERT INTO ?? SET ?`;
        return sendQuery(query, [table, object]);
    },
    update: function (tables, object, id) {
        let query = "UPDATE ?? SET ? WHERE ?";
        return sendQuery(query, [tables, object, id])
    },
    delete: function (tables, object) {
        let query = `DELETE FROM ${tables} WHERE ?`;
        return sendQuery(query, object);
    },
    // selectCount: function() {
    //     let query = "SELECT "
    //     query += ""
    // },
    employeeNames: function () {
        let query = "SELECT "
        query += "employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS name, role.title"
        query += " FROM "
        query += "employee, role"
        query += " WHERE "
        query += "employee.role_id = role.id"
        return sendQuery(query)
    },
    viewEmployees: function () {
        let query = "SELECT "
        query += "employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, ";
        query += "CONCAT(manager.first_name, ' ', manager.last_name) AS manager";
        query += " FROM ";
        query += "department, role, employee";
        query += " LEFT JOIN ";
        query += "employee manager on manager.id = employee.manager_id";
        query += " WHERE ";
        query += "role.department_id = department.id AND employee.role_id = role.id ";
        query += " ORDER BY ";
        query += "employee.id";
        return sendQuery(query);
    },
    viewRoles: function () {
        let query = "SELECT "
        query += "role.title, role.salary, department.name AS department"
        query += " FROM "
        query += "role, department"
        query += " WHERE "
        query += "department.id = role.department_id";
        return sendQuery(query);
    }
}
module.exports = queries;