const inquirer = require("inquirer");
const connection = require("./lib/sql/connection");
const queries = require("./lib/sql/queries");
const render = require("./lib/render/renderer");

const tables = {
    "role": [],
    "employee": [],
    "department": []
}

const mainMenuChoices = [
    "View all employees",
    "View all employees by department",
    // "View all employees by manager",
    // "Add a new employee",
    "Exit"
]

connection.connect(function (error) {
    if (error) throw error;
    console.log("Connected : ", connection.threadId);
    initializeData();
    mainMenu();
});

function initializeData() {
    queries.sendQuery(queries.selectAll, "employee", handleInitialize);
    queries.sendQuery(queries.selectAll, "role", handleInitialize);
    queries.sendQuery(queries.selectAll, "department", handleInitialize);
}

function handleInitialize(rows, table) {
    tables[table] = [];
    for (let i = 0; i < rows.length; i++) {
        tables[table][rows[i].id] = rows[i];
    }
}

function askAboutDepartment() {
    inquirer.prompt({
        type: "rawlist",
        message: "Which department do you want to see?",
        choices: tables["department"].map(department => department.name).filter(name => name),
        filter: function (input) {
            let temp = tables["department"].filter(department => department.name == input);
            return temp[0].id;
        },
        name: "department"
    }).then(({ department }) =>
        queries.sendQuery(queries.mainQuery + "  AND role.department_id = ", department, renderAll));
}

function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do today?",
        choices: mainMenuChoices,
        name: "task"
    }).then(({ task }) => {
        switch (mainMenuChoices.indexOf(task)) {
            case 0:
                queries.sendQuery(queries.mainQuery, "", renderAll);
                break;
            case 1:
                askAboutDepartment();
                break;
            // case 3:
            //     getEmployeeInfo();
            //     break;
            // case "V":
            //     viewMenu();
            //     break;
            default:
                connection.end();
        }
    });
}

function renderAll(employees) {
    render.allEmployeeResults(employees, tables);
    mainMenu();
}

function getEmployeeInfo() {
    inquirer.prompt([{
        message: "First Name: ",
        name: "first_name"
    },
    {
        message: "Last Name: ",
        name: "last_name"
    },
    {
        type: "rawlist",
        message: "Role: ",
        choices: tables["role"].map(role => role.title),
        name: "role_id",
        filter: function (input) {
            let temp = tables["role"].filter(role => role.title === input);
            return temp[0].id;
        }
    }]).then(addEmployee);
}

function addEmployee(employee) {
    connection.query("INSERT INTO employee SET ?", employee, function (error) {
        if (error) throw error;
        queries.sendQuery(queries.selectAll, "employee", initializeData);
        mainMenu();
        // connection.end();

    })
}
// minimum req - CLI app that allows
// add departments, roles, employees
// view departments, roles, employees
// update employee roles

// bonus
// update managers
// view by manager
// delete departments, roles, employees
// view total utilized budget of a department (combined salaries)