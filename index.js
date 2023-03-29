// Definitions and Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const sqlDb = require('./db/sqlDb');

// Server Start after sqlDb connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
  employee_tracker();
});
