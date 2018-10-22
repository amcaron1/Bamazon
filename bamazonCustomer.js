// inquirer is used to query the user
var inquirer = require("inquirer");

// mysql stores the database
var mysql = require("mysql");

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

// Displays the products to the user as a list
// After the user selects a product, they are queried for a quantity
// Finally, the item_id and quantity are sent to the processOrder funciton
function afterConnection() {

  // Stores the products for the user to choose
  var productArray = [];

  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;

    // Creates productArray with products to be used for user's selection in the inquire.prompt
    for (var i = 0; i < res.length; i++){
      productArray.push(res[i].item_id + " " + res[i].product_name + " " + "$" + res[i].price);
    }
    inquirer.prompt([
      {
        type: "list",
        message: "What product would you like to order?",
        choices: productArray,
        name: "productOptions",
      },
      {
        name: "user_quantity",
        message: "How many would you like?"
      }
    ]).then(function(answers) {
      if (answers.user_quantity > 0) {

        // Parses the item_id out of the user's product selection
        var endIndex = answers.productOptions.indexOf(" ");
        var user_item_id = answers.productOptions.slice(0,endIndex);
        processOrder(user_item_id,answers.user_quantity);
      }
      else {
        console.log("Invalid quantity.  Must be a number greater than zero.");
        connection.end();
      }
    })
  })
}

// If enough product is in stock, this function calculates quantity, calculates cost, and decrements product sales

function processOrder(user_item_id,user_quantity) {
  
  // Gets the quantity of the user's request item
  connection.query("SELECT price, stock_quantity, product_sales FROM products WHERE item_id =" + user_item_id, function(err, res) {
    if (err) throw err;

    // Test for enough quantity
    if (user_quantity <= res[0].stock_quantity) {

      // Calculates new quantity, cost, and product sales
      var new_quantity = res[0].stock_quantity - user_quantity;
      var cost = user_quantity * res[0].price;
      var new_product_sales = res[0].product_sales + cost;

      // Updates quantity and product sales in the database
      connection.query(
        "UPDATE products SET ? WHERE ?",
        [ {stock_quantity: new_quantity,
          product_sales: new_product_sales},
          {item_id: user_item_id}],
        function(err, res) {
        if (err) throw err;

        // Shows the user the cost
        console.log("The cost of your order is $" + cost);
        connection.end();
      })
    }
    else {
      console.log("Insufficient quantity in stock");
      connection.end();
    }
  })
}
