const mysql = require('mysql2');
const inquirer = require('inquirer');


const sqlDb = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'password',
      database: 'staff_db'
    },
    console.log(`Connected! (staff_db)`)
);
