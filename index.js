const inquirer = require("inquirer");
const db = require("./db/connection");

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected!");
  employee_tracker();
});

function employee_tracker() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "command",
        message: "What do you want to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Existing Employee",
          "Exit Application",
        ],
      },
    ])
    .then((answers) => {
      const command = answers.command;
      switch (command) {
        case "View All Departments":
          viewAllDepartments();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Existing Employee":
          updateEmployee();
          break;
        case "Exit Application":
          exitApplication();
          break;
      }
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
}

function exitApplication() {
  console.log("Goodbye!");
  process.exit();
}

function returnToMainMenu() {
  console.log("...Returning to main menu...");
  employee_tracker();
}

function viewAllDepartments() {
  db.execute("select * FROM department", (err, res) => {
    console.table(res);
    returnToMainMenu();
  });
}

function viewAllRoles() {
  const query = `SELECT 
  role.title AS "Title", 
  role.salary AS "Salary", 
  department.name AS "Department" FROM role
  LEFT JOIN department
  ON department.id=role.department_id`;
  db.execute(query, (err, res) => {
    console.table(res);
    returnToMainMenu();
  });
}

function viewAllEmployees() {
  const query = `SELECT 
  employee.id AS "Employee ID", 
  CONCAT(employee.first_name, ' ', employee.last_name) AS "Employee Name", 
  role.title AS Title, 
  department.name AS Department, 
  role.salary AS Salary, 
  IFNULL(CONCAT(manager.first_name, ' ', manager.last_name), 'None') AS "Manager Name"
  FROM employee 
  JOIN role 
  ON employee.role_id = role.id 
  JOIN department 
  ON role.department_id = department.id
  LEFT JOIN employee AS manager
  ON employee.manager_id = manager.id`;
  db.execute(query, (err, res) => {
    console.table(res);
    returnToMainMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the new department:",
      },
    ])
    .then((answer) => {
      const name = answer.name;
      db.execute(
        "INSERT INTO department (name) VALUES (?)",
        [name],
        (err, result) => {
          if (err) throw err;
          console.log(`New department '${name}' has been added successfully!`);
          returnToMainMenu();
        }
      );
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message: "Please enter the title of the new role:",
      },
      {
        type: "number",
        name: "salary",
        message: "Please enter the salary of the new role:",
      },
      {
        type: "list",
        name: "department_id",
        message: "Please select the department of the new role:",
        choices: [
          { value: 1, name: "Sales" },
          { value: 2, name: "Engineering" },
          { value: 3, name: "Finance" },
        ],
      },
    ])
    .then((answers) => {
      db.execute(
        "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
        [answers.title, answers.salary, answers.department_id],
        (err, res) => {
          if (err) throw err;
          console.log(
            `New role '${answers.title}' has been added successfully!`
          );
          returnToMainMenu();
        }
      );
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Please enter the first name of the new employee:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Please enter the last name of the new employee:",
      },
      {
        type: "list",
        name: "role_id",
        message: "Please select the role of the new employee:",
        choices: [
          { value: 1, name: "Sales Manager" },
          { value: 2, name: "Sales Representative" },
          { value: 3, name: "Engineering Manager" },
          { value: 4, name: "Software Engineer" },
          { value: 5, name: "Finance Manager" },
          { value: 6, name: "Accountant" },
        ],
      },
      {
        type: "list",
        name: "manager_id",
        message: "Please select the manager of the new employee:",
        choices: [
          { value: 1, name: "John Doe" },
          { value: 2, name: "Tom Williams" },
          { value: 3, name: "Sarah Johnson" },
          { value: null, name: "None" },
        ],
      },
    ])
    .then((answers) => {
      db.execute(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
        [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id,
        ],
        (err, res) => {
          if (err) throw err;
          console.log(
            `New employee '${answers.first_name} ${answers.last_name}' has been added successfully!`
          );
          returnToMainMenu();
        }
      );
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
}

function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "number",
        name: "id",
        message: "Please enter the ID of the employee you want to update:",
      },
      {
        type: "input",
        name: "first_name",
        message: "Please enter the employee's new first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Please enter the employee's new last name:",
      },
      {
        type: "number",
        name: "role_id",
        message: "Please enter the employee's new role ID:",
      },
      {
        type: "number",
        name: "manager_id",
        message: "Please enter the employee's new manager ID:",
      },
    ])
    .then((answers) => {
      db.execute(
        "UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?",
        [
          answers.first_name,
          answers.last_name,
          answers.role_id,
          answers.manager_id,
          answers.id,
        ],
        (err, res) => {
          if (err) throw err;
          console.log(
            `Employee with ID ${answers.id} has been updated successfully!`
          );
          returnToMainMenu();
        }
      );
    })
    .catch((error) => {
      if (error) {
        console.log(error);
      }
    });
}
