// import queries from '../sql/queries'

const render = {
    allEmployeeResults: function (employees, tables) {
        console.clear();
        console.log(`id   ${padString("first_name")}  ${padString("second_name")}  ${padString("title")}  ${padString("department")}  ${padString("salary")}  ${padString("manager")}`);
        console.log("-".repeat(120));
        employees.forEach(employee => {
            if (employee) {
                let { id, first_name, last_name, title, salary, department_id, manager_id } = employee;
                let manager = "none";
                if (manager_id) {
                    manager = tables["employee"][manager_id].first_name + " " + tables["employee"][manager_id].last_name;
                }
                // let { title, salary, department_id } = tables["role"][role_id]
                let { name } = tables["department"][department_id]
                console.log(`${id}${(id < 10 ? "  " : " ")}| ${padString(first_name)}| ${padString(last_name)}| ${padString(title)}| ${padString(name)}| ${padString(salary.toString())}| ${padString(manager)}`);
            }
        });
    }
}

function padString(string) {
    let limit = 18;
    if (string.length <= limit) {
        return string + " ".repeat(limit - string.length);
    }
    else {
        return string.slice(0, limit);
    }
}



module.exports = render