const inquirer = require("inquirer");
const connection = require("./lib/sql/connection");
const queries = require("./lib/sql/queries");
const render = require("./lib/render/renderer");
const { getAllRoles, getAllDepartments, getRolesInDepartment } = require("./lib/sql/queries");
const table = require("console.table").getTable;

// cache data for making lists
// const tables = {
//     "role": [],
//     "employee": [],
//     "department": [],
//     "manager": []
// }

const mainMenuChoices = [
    "View all employees",
    "View employees by department",
    // "View employees by manager",
    "View employees by role",
    "Add an employee",
    // "Remove an employee",
    // "Remove a department",
    // "Remove a role",
    // "Set a manager for an employee",
    "Exit"
]


// connect to the server to begin the program
connection.connect(function (error) {
    if (error) throw error;
    console.log("Connected : ", connection.threadId);
    mainMenu();
});

// function askWhichManager() {
//     inquirer.prompt({
//         type: "list",
//         message: "Which manager do you want to see?",
//         choices: tables["manager"].map(manager => manager).filter(name => name),
//         filter: function (input) {
//             return tables["manager"].indexOf(input);
//         },
//         name: "manager_id"
//     }).then(({ manager_id }) => {
//         let output = "IS NULL";
//         if (manager_id > 0) {
//             output = `= ${manager_id}`
//         }
//         queries.sendQuery(`${queries.departmentJoinQuery} AND employee.manager_id ${output}`, "", renderEmployees);
//     });
// }

function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do today?",
        choices: mainMenuChoices,
        name: "task"
    }).then(({ task }) => {
        switch (task) {
            case "View all employees":
                queries.getReadableEmployeeTable().then(showResultTable);
                break;
            case "View employees by department":
                queries.getAllDepartments()
                    .then(askWhichDepartment)
                    .then(queries.getReadableDepartmentTable)
                    .then(showResultTable);
                break;
            case "View employees by role":
                queries.getAllRoles()
                    .then(askWhichRole)
                    .then(queries.getReadableRoleTable)
                    .then(showResultTable);
                break;
            // case "View employees by manager":
            //     askWhichManager();
            //     break;
            case "Add an employee":
                enterEmployeeName().then(enterEmployeeRole)
                break;
            // case "Set a manager for an employee":
            //     changeManager();
            //     break;
            default:
                connection.end();
        }
    });
}

function showResultTable(resultTable) {
    console.table(table(resultTable));
    mainMenu();
}

function askWhichDepartment(departments) {
    // console.log(departments);
    return inquirer.prompt({
        type: "list",
        message: "Which department?",
        choices: departments.map(department => department.name),
        filter: function(input) {
            for (let i = 0; i < departments.length; i++) {
                if (departments[i].name == input) {
                    return departments[i];
                }
            }
        },
        name: "department"
    });
}

function askWhichRole(roles) {
    // console.log(roles);
    return inquirer.prompt({
        type: "list",
        message: "Which role?",
        choices: roles.map(role => role.title),
        filter: function(input) {
            for (let i = 0; i < roles.length; i++) {
                if (roles[i].title == input) {
                    
                    return roles[i];
                }
            }
        },
        name: "role"
    });
}

function enterEmployeeName() {
    return inquirer.prompt([
        {
            message: "First Name: ",
            name: "first_name"
        },
        {
            message: "Last Name: ",
            name: "last_name"
        }
    ]);
}

function enterEmployeeRole(employee) {
    getAllDepartments()
    .then(askWhichDepartment)
    .then(getRolesInDepartment)
    .then(askWhichRole)
    .then(({role}) => {
        employee.role_id = role.id;
        queries.insertNewEmployee(employee);
    });
}

// function postEmployee(employee) {
//     connection.query("INSERT INTO employee SET ?", employee, function (error) {
//         if (error) throw error;
//         queries.sendQuery(queries.selectAll, "employee", initializeData);
//         mainMenu();
//     });
// }

// function employeeArray() {
//     return tables["employee"].map(employee => (employee ? `${employee.first_name} ${employee.last_name}` : null));
// }

// function changeManager() {
//     inquirer.prompt({
//         type: "list",
//         message: "Which employee do you want to set a manager for?",
//         choices: employeeArray(),
//         name: "employeeName"
//     })
//     // connection.end();
// }
// minimum req - CLI app that allows
// add departments, roles, employees
// view departments, roles, employees
// update employee roles

// bonus
// update managers
// view by manager
// delete departments, roles, employees
// view total utilized budget of a department (combined salaries)