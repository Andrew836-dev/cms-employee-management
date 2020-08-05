const connection = require("./connection");

const managerNameConcat = 'CONCAT(manager.first_name, " ", manager.last_name) AS manager'
const namesForList = 'CONCAT(employee.first_name, " ", employee.last_name) AS name'
const readableConditions = 'role.department_id = department.id AND employee.role_id = role.id';
const leftJoinManager = 'LEFT JOIN employee manager ON manager.id = employee.manager_id'
const allThreeTables = 'department, role, employee ';
const readableEmployeeData = `employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department, ${managerNameConcat}`
const allEmployeeManagerJoinQuery = `SELECT ${readableEmployeeData} FROM ${allThreeTables} ${leftJoinManager} WHERE ${readableConditions} ORDER BY employee.id`;
const departmentJoinQuery = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, role.department_id FROM employee INNER JOIN role ON role.id = employee.role_id`;
// const selectManagers = "SELECT DISTINCT manager_id FROM employee";

const selectQuery = async function (columns, tables, conditions) {
    let query = 'SELECT ' + columns;
    query += ' FROM ' + tables;
    if (conditions) {
        query += " " + conditions;
    }
    // console.log(query);
    return new Promise((resolve, reject) => {
        connection.query(query, function (error, response) {
            if (error) reject(error);
            // console.log(response);
            resolve(response);
        });
    });
}

const queries = {
    // selectAll: async function (table) {
    //     return new Promise((resolve, reject) => {
    //         sendQuery(`SELECT * FROM ${table}`, resolve, reject);
    //     });
    // },
    getReadableEmployeeTable: function () {
        return selectQuery(readableEmployeeData, allThreeTables, `${leftJoinManager} WHERE ${readableConditions} ORDER by employee.id`);
    },
    getReadableDepartmentTable: function ({department}) {
        return selectQuery(readableEmployeeData, allThreeTables, `${leftJoinManager} WHERE ${readableConditions} AND department.id = ${department.id} ORDER by employee.id`);
    },
    getReadableRoleTable: function ({role}) {
        return selectQuery(readableEmployeeData, allThreeTables, `${leftJoinManager} WHERE ${readableConditions} AND role.id = ${role.id} ORDER by employee.id`);
    },
    getAllDepartments: function() {
        return selectQuery("id, name", "department");
    },
    getRolesInDepartment: function ({department}) {
        return selectQuery("id, title", "role", `WHERE department_id = ${department.id};`)
    },
    getAllRoles: function() {
        return selectQuery("id, title", "role")
    },
    getAllManagers: function () {
        return selectQuery(`DISTINCT ${managerNameConcat}` `employee ${leftJoinManager}`);
    }
}

module.exports = queries;