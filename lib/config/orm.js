const connection = require("./connection");

const managerNameConcat = 'CONCAT(manager.first_name, " ", manager.last_name) AS manager'
const namesForList = 'CONCAT(employee.first_name, " ", employee.last_name) AS name'
const readableConditions = 'role.department_id = department.id AND employee.role_id = role.id';
const leftJoinManager = 'LEFT JOIN employee manager ON manager.id = employee.manager_id'
const allThreeTables = 'department, role, employee ';
const readableEmployeeData = `employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name as department, ${managerNameConcat}`
const allEmployeeManagerJoinQuery = `SELECT ${readableEmployeeData} FROM ${allThreeTables} ${leftJoinManager} WHERE ${readableConditions}`;
const employeeOrder = `ORDER BY employee.id`;
const departmentJoinQuery = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title, role.salary, role.department_id FROM employee INNER JOIN role ON role.id = employee.role_id`;
// const selectManagers = "SELECT DISTINCT manager_id FROM employee";

const sendQuery = async function (query, object = []) {
    return new Promise((resolve, reject) => {
        // console.log(query);
        connection.query(query, object, function (error, response) {
            if (error) reject(error);
            // console.log(response);
            resolve(response);
        });
    });
};

const queries = {
    selectWhere: function (columns, tables, conditions = "") {
        let query = `SELECT ${columns} FROM ${tables} ${conditions}`;
        return sendQuery(query);
    },
    create: function (tables, object) {
        let query = `INSERT INTO ${tables} SET ?`;
        return sendQuery(query, object);
    },
    delete: function (tables, object) {
        let query = `DELETE FROM ${tables} WHERE ?`;
        return sendQuery(query, object);
    },
    finalQuery: function (condition) {
        return sendQuery(`${allEmployeeManagerJoinQuery} ${condition ? "AND " + condition : ""} ${employeeOrder}`);
    },
    getAllEmployeeNames: function () {
        return sendQuery(`SELECT ${namesForList}, role.title FROM employee, role WHERE role.id = employee.role_id ${employeeOrder}`)
    },
    postEmployee: function (object) {
        return insertQuery("employee", object);
    },
    postDepartment: function (object) {
        return insertQuery("department", object);
    },
    getReadableEmployeeTable: function () {
        return selectQuery(readableEmployeeData, allThreeTables, `${leftJoinManager} WHERE ${readableConditions} ORDER by employee.id`);
    },
    getReadableDepartmentTable: function ({ department }) {
        return selectQuery(readableEmployeeData, allThreeTables, `${leftJoinManager} WHERE ${readableConditions} AND department.id = ${department.id} ORDER by employee.id`);
    },
    getReadableRoleTable: function ({ role }) {
        return selectQuery(readableEmployeeData, allThreeTables, `${leftJoinManager} WHERE ${readableConditions} AND role.id = ${role.id} ORDER by employee.id`);
    },
    getDepartmentIdFor: function (department_name) {
        return selectQuery("id, name", "department", `WHERE name = "${department_name}"`);
    },
    // getRoleIdFor: function (role_name) {
    //     return selectQuery("id, title", "role", `WHERE title = "${role_name}"`);
    // },
    getRolesInDepartment: function ({ department }) {
        return selectQuery("id, title", "role", `WHERE department_id = ${department.id};`)
    },
    getAllDepartments: function () {
        return selectQuery("id, name", "department");
    },
    getAllRoles: function () {
        return selectQuery("id, title", "role")
    },
    getAllManagers: function () {
        return selectQuery(`DISTINCT ${managerNameConcat}` `employee ${leftJoinManager}`);
    }
}

module.exports = queries;