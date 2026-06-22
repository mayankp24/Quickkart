# Quickkart – E-Commerce Platform
Quickkart is a web application of an e-commerce platform that is developed using Node.js, Express.js, MongoDB, and EJS. This application  comprises of authentication, cart operations, products administration, and file upload modules.
This application was developed with the intention of providing an entire shopping experience with maintainable code.
---
## Features

### Authentication

* User registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Secure cookie-based sessions

### Product Management

* Browse products dynamically
* Filter products by categories and discounts
* Responsive product listing and UI states

### Shopping Cart

* Add products to cart
* Increase or decrease quantity
* Remove products from cart
* Persistent cart storage in MongoDB

### Admin Dashboard

* Protected owner/admin routes
* Create, edit, update, and delete products
* Product image uploads using multer

### Admin Setup Utility

* Create or reset admin credentials through a seed script

---

## Tech Stack

Frontend

* EJS
* HTML
* CSS
* Tailwind CSS

Backend

* Node.js
* Express.js

Database

* MongoDB
* Mongoose

Authentication

* JSON Web Tokens
* Cookie Parser

Additional Tools

* Express Session
* Connect Flash
* Multer

---

## Project Structure

Scratch_Ecommerce/

assets/
config/
controllers/
middlewares/
models/
public/
routes/
views/

app.js
create-admin.js
.env.example
package.json

---

## Installation


### Configure Environment Variables

Create a .env file and add:

JWT_KEY=your_jwt_key

EXPRESS_SESSION_SECRET=your_session_secret

---


### Create Admin Account

Run:
node create-admin.js
This creates or resets the default administrator account.
You may also initialize an admin using:
http://localhost:3000/owners/create-dummy

## Admin Login

Route:

http://localhost:3000/owners/login

Default credentials:

Email: admin@gmail.com

Password: admin

---

## Future Improvements

* Google OAuth authentication
* Payment gateway integration
* Order history
* Product reviews
* Wishlist functionality
* Deployment support

---

