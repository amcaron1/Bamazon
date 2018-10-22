// inquirer is used to query the user
var inquirer = require("inquirer");

// mysql stores the database
var mysql = require("mysql");

// Stores the options for the manager
var choiceArray = [
    "View Products for Sale",
    "View Low Inventory",
    "Add or Subtract Inventory",
    "Add New Product"];

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

// Gives the manager a list of options and calls the appropriate function based on the choice
function afterConnection() {
    inquirer.prompt([
        {
            type: "list",
            message: "Manager Options",
            choices: choiceArray,
            name: "managerOptions",
        },
    ])
    .then(function(response) {

        switch (response.managerOptions){

            case "View Products for Sale":
                console.log("View Products for Sale");

                // Sets the threshold value to -1 to signal "all" products
                threshold = -1;
                viewProducts(threshold);
                break;

            case "View Low Inventory":
                console.log("View Low Inventory");

                // Sets the threshold value to 5 to return only products with quantity less than 5
                threshold = 5;
                viewProducts(threshold);
                break;

            case "Add or Subtract Inventory":
                console.log("Add or Subtract Inventory");
                addSubInventory();
                break;

            case "Add New Product":
                console.log("Add New Product");
                addNewProduct();
                break;

            // If the action does not match one of the cases, the user is alerted that the input is invalid
            default:
                console.log("You must make a selection");
        }
    })
}

// If threshold is -1, displays all products
// Else displays products with quantity less than 5
function viewProducts(threshold) {
    if (threshold == -1){
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                console.log(res[i].item_id + " " + res[i].product_name + " " + "$" + res[i].price +" " + res[i].stock_quantity);
            }
        })
    }
    else {
        connection.query("SELECT * FROM products WHERE stock_quantity <" + threshold, function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++){
                console.log(res[i].item_id + " " + res[i].product_name + " " + "$" + res[i].price +" " + res[i].stock_quantity);
            }
        })
    }
    connection.end();
}

// Displays all of the items as a list
// Prompts manager for a list item and a new quantity
// Updates the quantity of the item that the manager chose
function addSubInventory() {

    // Stores the products for the user to choose
    var productArray = [];


    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++){
            productArray.push(res[i].item_id + " " + res[i].product_name + " " + res[i].stock_quantity);
        }
        inquirer.prompt([
            {
                type: "list",
                message: "Product Options",
                choices: productArray,
                name: "productOptions",
            },
            {
            name: "stock_quantity",
            message: "What is the new stock quantity?"
            }
        ]).then(function(answers) {
            if (answers.stock_quantity >= 0) {

                // Finds the end of the item_id from the answers
                var endIndex = answers.productOptions.indexOf(" ");
                connection.query("UPDATE products SET ? WHERE ?",
                [{
                    stock_quantity: answers.stock_quantity
                },
                {

                    // Slices off the item_id from the answers
                    item_id: answers.productOptions.slice(0,endIndex)
                }],
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " products updated!\n");
                    connection.end();
                })
            }
            else {
                console.log("Invalid stock quantity.  Must be a number greater than or equal to zero.");
                connection.end();
            }
        })
    })
}

// Prompts the manager for a new product
// Inserts the new product into the database
function addNewProduct() {
    inquirer.prompt([
        {
        name: "product_name",
        message: "What is the product name?"
        },
        {
        name: "department_name",
        message: "What is the department?"
        },
        {
        name: "price",
        message: "What is the price?"
        },
        {
        name: "stock_quantity",
        message: "What is the quantity?"
        }
    ]).then(function(answers) {
        if (answers.price > 0.00 && answers.stock_quantity > 0) {
            connection.query("INSERT INTO products SET ?",
                {
                product_name: answers.product_name,
                department_name: answers.department_name,
                price: answers.price,
                stock_quantity: answers.stock_quantity
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                    connection.end();
                }
            )
        }
        else {
            console.log("Invalid stock quantity or price.  Must be numbers greater than zero.");
            connection.end();
        }
    })
}  