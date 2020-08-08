const inquirer = require("inquirer");
const connection = require("./lib/config/connection");
const orm = require("./lib/config/orm");
// const { getAllRoles, getAllDepartments, getRolesInDepartment } = require("./lib/sql/queries");
const table = require("console.table").getTable;

const askWhichDepartment = {
    type: "list",
    message: "Which department?",
    choices: function () {
        return orm.selectWhere("DISTINCT name", "department");
    },
    filter: function (answer) {
        return new Promise(resolve => {
            orm.selectWhere("id, name", "department", `WHERE name = "${answer}"`)
            .then(([department]) => {
                resolve(department);
            });
        });
    },
    name: "department"
}

const askWhichRole = {
    type: "list",
    message: "Which role?",
    choices: function () {
        return orm.selectWhere("title as name", "role");
    },
    filter: function (answer) {
        return new Promise(resolve => {
            orm.selectWhere("id, title", "role", `WHERE title = "${answer}"`)
                .then(([role]) => resolve(role));
        });
    },
    name: "role"
}

const askWhichEmployee = {
    type: "list",
    message: "Which employee?",
    choices: function () {
        return new Promise(resolve => {
            orm.selectWhere("employee.id, employee.first_name, employee.last_name, role.title", "role, employee", "WHERE role.id = employee.role_id ORDER BY employee.id")
                .then(result => resolve(result.map(({ id, first_name, last_name, title }) => `${id} - ${first_name} ${last_name} - ${title}`)));
        });
    },
    filter: function (answer) {
        return answer.split(" - ")[0];
    },
    name: "id"
}

const mainMenuChoices = [
    "View all employees",
    "View employees by department",
    // "View employees by manager",
    "View employees by role",
    "Add employee",
    "Add department",
    "Add role",
    "Remove an employee",
    // "Remove a department",
    // "Remove a role",
    // "Set a manager for an employee",
    "Exit"
]


// // connect to the server to begin the program
// connection.connect(function (error) {
//     if (error) throw error;
//     console.log("Connected : ", connection.threadId);
//     return mainMenu();
// });

function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do today?",
        choices: mainMenuChoices,
        name: "task"
    }).then(({ task }) => {
        switch (task) {
            case "View all employees":
                return orm.finalQuery().then(showResultTable);
            case "View employees by department":
                return inquirer.prompt(askWhichDepartment)
                    .then(({ department }) => {
                        return orm.finalQuery("role.department_id = " + department.id);
                    })
                    .then(showResultTable);
            case "View employees by role":
                return inquirer.prompt(askWhichRole)
                    .then(({ role }) => {
                        return orm.finalQuery("employee.role_id = " + role.id);
                    })
                    .then(showResultTable);
            // case "View employees by manager":
            //     askWhichManager();
            //     break;
            case "Add employee":
                return enterEmployeeInfo()
                    .then(employee => {
                        return orm.create("employee", employee);
                    }).then(mainMenu);
            case "Add department":
                return enterDepartmentInfo()
                    .then(department => {
                        return orm.create("department", department);
                    }).then(mainMenu);
            case "Add role":
                return enterRoleInfo()
                    .then(roleData => {
                        
                    }).then(mainMenu);
            case "Remove an employee":
                return inquirer.prompt(askWhichEmployee)
                    .then(employee => {
                        return orm.delete("employee", employee);
                    }).then(mainMenu);
            // case "Set a manager for an employee":
            //     changeManager();
            //     break;
            default:
                return connection.end();
        }
    });
}

function showResultTable(resultTable) {
    console.table(table(resultTable));
    return mainMenu();
}

function enterDepartmentInfo() {
    return inquirer.prompt(
        {
            message: "Enter department name:",
            name: "name"
        }
    );
}

function enterRoleInfo() {
    return inquirer.prompt([
        {
            message: "Enter role title:",
            name: "title"
        },
        {
            message: "Enter salary for role:",
            name: "salary"
        },
        askWhichDepartment
    ])
}

function parseRoleInfo(roleData) {
    let role = { 
        title: roleData.title,
        salary: roleData.salary,
        department_id: roleData.department.id }
    return orm.create("role", role);
}
function enterEmployeeInfo() {
    return inquirer.prompt([
        {
            message: "First Name: ",
            name: "first_name"
        },
        {
            message: "Last Name: ",
            name: "last_name"
        },
        {
            type: "list",
            message: "Choose a role: ",
            choices: function () {
                return orm.selectWhere("DISTINCT title as name", "role", "ORDER BY department_id");
            },
            filter: function (answer) {
                return new Promise(resolve => {
                    orm.selectWhere("id", "role", `WHERE title = "${answer}"`)
                        .then(([role]) => resolve(role.id));
                });
            },
            name: "role_id"
        }
    ]
    );
}

// function askWhichDepartment() {
//     return inquirer.prompt(questionArray.askWhichDepartment
//         // {
//         //     type: "list",
//         //     message: "Which department?",
//         //     name: "department",
//         //     choices: function () {
//         //         return queries.getAllDepartments();
//         //     },
//         //     filter: function (answer) {
//         //         return new Promise(resolve => {
//         //             queries.getDepartmentIdFor(answer).then(([department]) => {
//         //                 console.log(department);
//         //                 resolve(department);
//         //             });
//         //         });
//         //     }
//         // }
//     );
// }


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

// minimum req - CLI app that allows
// add departments, roles, employees
// view departments, roles, employees
// update employee roles

// bonus
// update managers
// view by manager
// delete departments, roles, employees
// view total utilized budget of a department (combined salaries)

mainMenu();