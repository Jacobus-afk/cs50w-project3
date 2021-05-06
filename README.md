# Project 3

Web Programming with Python(Django) and JavaScript

## Requirements

* **Menu:** Support for all available menu items from [Pinochio's Pizza](http://www.pinocchiospizza.net/menu.html). Support for adding toppings to pizzas and subs and choosing large and small sizes. All menu items a displayed in a menu view for the user to choose from

* **Adding items:** Django admin configured to allow addition/removal/update to/on menu items

* **User registration/authentication:** New users allowed to register by providing username, email address and password. Only logged in users are allowed to checkout orders placed

* **Shopping cart:** Orders selected by the user from the menu page are passed on to the shopping cart view. Only registered and logged in users are allowed to checkout a shopping cart and place an order. The shopping cart contents is saved in a Django session and will propogate between browser sessions

* **Placing an order:** Once at least one item is in a user's cart, the functionality to place orders will be enabled. Placing an order will prompt a logged out user to log in before ordering can proceed. 

* **Viewing orders:** Logged in users will be taken to a page where pending orders will be displayed. Employees logged in to the website will have access to a page displaying all orders placed.

* **Personal touch (Realtime order updates):** Employees can flag an order item as prepared and delivered, and said item will be updated on customer's order view


* **Notes:** This project utilizes Django channels to facilitate websocket communications. Redis has to be run for channel layers to work correctly: *docker run -p 6379:6379 -d redis:5*
