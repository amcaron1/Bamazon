# Bamazon

- Overview
    - bamazonCustomer
        - Displays the products to the user as a list
        - After the user selects a product, they are queried for a quantity
        - The item_id and quantity are sent to the processOrder funciton
        - If enough product is in stock, the code calculates cost, calculates product sales, and decrements quantity
        - It then displays the cost to the user
    - bamazonManager
        - Gives the manager a list of options and calls the appropriate function based on the choice
            - View Products for Sale: Displays all of the product
            - View Low Inventory: Displays all of the products with quantity less than 5
            - Add or Subtract Inventory:  Allows manager to add to or subtract from the quantity of an item
            - Add New Product: Allows manager to add a new product
    - bamazonSupervisor
        - Gives the supervisor a list of options and calls the appropriate function based on the choice
            - View Product Sales by Department: Creates a table made up of the department table plus product sales and total profit by department
            - Create New Department: Allows supervisor to add a new department

- Screen Shots
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonCustomer1.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonCustomer2.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonCustomer3.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonManager1.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonManager2.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonManager3.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonManager4.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonSupervisor1.JPG
    - https://github.com/amcaron1/Bamazon/blob/master/images/bamazonSupervisor2.JPG


- Key or new skills
    - mysql queries
    - console.table
    
- Bamazon Links
    - Deployed: https://amcaron1.github.io/Bamazon/
    - GitHub repository: https://github.com/amcaron1/Bamazon/

- Portfolio Links
    - Deployed: https://amcaron1.github.io/Bootstrap-Portfolio/
    - GitHub repository: https://github.com/amcaron1/Bootstrap-Portfolio/