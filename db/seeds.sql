INSERT INTO department (name)
VALUES ("Sales"), ("Marketing"), ("Engineering"), ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 60000, 1), ("Market Researcher", 70000, 2), ("Engineer", 55000, 3), ("Accountant", 60000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Smith", 1), ("Billy", "Herrington", 2), ("Elon", "Musk", 3);