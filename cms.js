const orm = require("./lib/config/orm");
const inquirer = require("inquirer");
const table = require("console.table");

function showResults(data) {
    console.log(table.getTable(data));
    mainMenu();
}

function createEmployee() {
    return inquirer.prompt([
        {
            message: "What is the employee first name?",
            name: "first_name"
        },
        {
            message: "What is the employee last name?",
            name: "last_name"
        },
        {
            type: "list",
            message: "What is the employee role?",
            choices: function () {
                return new Promise(resolve => {
                    orm.selectAsName("title", "role")
                        .then(roles => {
                            return resolve(roles);
                            // .map(role => {
                            //     return {  };
                            // }));
                        });
                });
            },
            filter: function (answer) {
                return new Promise(resolve => {
                    orm.selectWhere("id", "role", "role.title", answer)
                        .then(([{ id }]) => resolve);
                });
            }
        }
    ]);
}

function createRole() {
    return inquirer.prompt([
        {
            message: "What is the title of the role?",
            name: "title"
        },
        {
            message: "What is the salary for the role?",
            name: "salary",
            filter: function (answer) {
                return parseFloat(answer);
            }
        },
        {
            type: "list",
            message: "Which department is this role in?",
            name: "department_id",
            choices: function () {
                return orm.selectDistinct(["id", "name"], "department")
            },
            filter: function (answer) {
                return new Promise(resolve => {
                    orm.selectWhere("id", "department", "name", answer)
                        .then(([{ id }]) => resolve(id));
                });
            }
        }
    ]);
}
function createDepartment() {
    return inquirer.prompt(
        {
            message: "What is the name of the department?",
            name: "name"
        });
}

function mainMenu() {
    inquirer.prompt({
        message: "Welcome, what would you like to do?",
        type: "list",
        choices: mainMenuOptions,
        name: "menu"
    }).then(showNextMenu)
        .catch(error =>
            console.log(error));
}

const mainMenuOptions = [
    "View all employees",
    "View all departments",
    "View all roles",
    "Add department",
    "Add role",
    "Add employee",
    "Delete an employee",
    "Exit"
]

function showNextMenu({ menu }) {
    switch (menu) {
        case "View all employees":
            orm.viewEmployees().then(showResults);
            break;
        case "View all departments":
            orm.selectDistinct("name", "department").then(showResults);
            break;
        case "View all roles":
            orm.viewRoles().then(showResults);
            break;
        case "Add employee":
            orm.selectAsName("title", "role")
                // createEmployee()
                .then(console.log);
            break;
        case "Add role":
            createRole()
                .then(role => {
                    console.log("Creating", role.title);
                    orm.create("role", role)
                }).then(mainMenu);
            break;
        case "Add department":
            createDepartment()
                .then(department => {
                    console.log("Creating", department.name);
                    orm.create("department", department);
                }).then(mainMenu);
            break;
        case "Delete an employee":
            orm.employeeNames().then(names => {
                let choice = names.map(({ id, name, title }) => {
                    return `${id} - ${name} - ${title}`
                });
                chooseEmployee(choice).then(chosen => {
                    console.log("Removing employee number", chosen);
                    orm.delete("employee", chosen)
                        .then(mainMenu);
                });
            });
            break;
        default:
            orm.closeConnection();
            console.log("Connection closed : ", menu);
    }
}

function chooseEmployee(arrayIn) {
    return inquirer.prompt([{
        type: "list",
        message: "Choose a current employee",
        choices: arrayIn,
        filter: function (answer) {
            return answer.split(" - ")[0];
        },
        name: "id"
    }]);
}

module.exports = mainMenu;