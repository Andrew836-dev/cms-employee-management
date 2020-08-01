DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE employee (
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT NOT NULL,
manager_id INT,
id INT AUTO_INCREMENT,
PRIMARY KEY (id),
FOREIGN KEY (role_id),
FOREIGN KEY (manager_id)
);

CREATE TABLE role (
title VARCHAR(30),
salary DECIMAL,
department_id INT,
id INT AUTO_INCREMENT,
PRIMARY KEY (id),
FOREIGN KEY (department_id)
);

CREATE TABLE department (
name VARCHAR(30),
id INT AUTO_INCREMENT,
PRIMARY KEY (id)
)