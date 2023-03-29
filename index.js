// Definitions and Dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const connection = require('./db/connection');

// Server Start after connection made
db.connect(err => {
  if (err) throw err;
  console.log('Database connected!');
  employee_tracker();
});
