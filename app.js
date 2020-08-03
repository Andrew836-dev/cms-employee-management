const inquirer = require("inquirer");
const connection = require("./lib/sql/connection");
const queries = require("./lib/sql/queries");
const render = require("./lib/render/renderer");

const tables = {
    "role": [],
    "employee": [],
    "department": [],
    "manager": []
}

const mainMenuChoices = [
    "View all employees",
    "View all employees by department",
    "View all employees by manager",
    "Add a new employee",
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
    queries.sendQuery(queries.selectManagers, "", populateManagers);
}

function changeEmployeeIdToName(id) {
    if (tables["employee"].length > 1) {
        if (tables["employee"][id])
            return tables["employee"][id].first_name + " " + tables["employee"][id].last_name;
    }
}

function populateManagers(rows) {
    tables["manager"] = [];
    if (tables["employee"].length > 1) {
        rows.forEach(({ manager_id }) => {
            if (!manager_id) tables["manager"][0] = "None";
            else tables["manager"][manager_id] = changeEmployeeIdToName(manager_id);
        });
    }
}
function handleInitialize(rows, table) {
    tables[table] = [];
    for (let i = 0; i < rows.length; i++) {
        tables[table][rows[i].id] = rows[i];
    }
}

function askWhichDepartment() {
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
        queries.sendQuery(queries.departmentJoinQuery + "  AND role.department_id = ", department, renderEmployees));
}

function askWhichManager() {
    inquirer.prompt({
        type: "rawlist",
        message: "Which manager do you want to see?",
        choices: tables["manager"].map(manager => manager).filter(name => name),
        filter: function (input) {
            return tables["manager"].indexOf(input);
        },
        name: "manager"
    }).then(({ manager }) => {
        queries.sendQuery(`${queries.departmentJoinQuery} AND employee.manager_id ${manager > 0 ? "= " + manager: "IS NULL"}`, "", renderEmployees);
    });
}

function mainMenu() {
    inquirer.prompt({
        type: "list",
        message: "What would you like to do today?",
        choices: mainMenuChoices,
        name: "task"
    }).then(({ task }) => {
        switch (task) {
            case "View all employees":
                queries.sendQuery(queries.departmentJoinQuery, "", renderEmployees);
                break;
            case "View all employees by department":
                askWhichDepartment();
                break;
            case "View all employees by manager":
                askWhichManager();
                break;
            case "Add a new employee":
                getEmployeeInfo();
                break;
            default:
                connection.end();
        }
    });
}

function renderEmployees(employees) {
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