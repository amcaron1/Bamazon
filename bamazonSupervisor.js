// inquirer is used to query the user
var inquirer = require("inquirer");

// mysql stores the database
var mysql = require("mysql");

// console.table displays the query results
const cTable = require('console.table');

// Stores the options for the supervisor
var choiceArray = [
    "View Products by Department",
    "Create New Department"];

// Sets up database connection parameters
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "bamazon_db"
});

// Creates the connection to the database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  afterConnection();
});

// Gives the supervisor a list of options and calls the appropriate function based on the choice
function afterConnection() {
    inquirer.prompt([
        {
            type: "list",
            message: "Supervisor Options",
            choices: choiceArray,
            name: "supervisorOptions",
        },
    ])
    .then(function(response) {

        switch (response.supervisorOptions){

            case "View Products by Department":
                viewProductSales();
                break;

            case "Create New Department":
                createDepartment();
                break;

            // If the action does not match one of the cases, the user is alerted that the input is invalid
            default:
                console.log("You must make a selection");
        }
    })
}

// Creates a table made up of the department table plus product sales and total profit by department
function viewProductSales() {

    // Stores the data for the table
    var dataArray = [];

    connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, SUM(products.product_sales) AS product_sales, (SUM(products.product_sales)-departments.overhead_costs) AS total_profit FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY department_name ORDER BY departments.department_id ASC", function(err, res) {
        if (err) throw err;

        // Stores a row of the table in the rowArray and then pushes it to the dataArray
        for (var i = 0; i < res.length; i++){
            var rowArray = [res[i].department_id, res[i].department_name, res[i].overhead_costs, res[i].product_sales, res[i].total_profit];
            dataArray.push(rowArray);
        }

        // Displays the table
        console.log();
        console.table(['department_id', 'department_name', 'overhead_costs', 'product_sales', 'total_profit'], dataArray);
    })
        connection.end();
}

// Prompts the supervisor for a new department and its overhead costs
// Inserts the new department into the database
function createDepartment() {
    inquirer.prompt([
        {
        name: "department_name",
        message: "What is the department name?"
        },
        {
        name: "overhead_costs",
        message: "What are the overhead costs?"
        }
    ]).then(function(answers) {
        
        connection.query("INSERT INTO departments SET ?",
            {
            department_name: answers.department_name,
            overhead_costs: answers.overhead_costs
            },
            function(err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " product inserted!\n");
            }
        )
        connection.end();
    })
}  