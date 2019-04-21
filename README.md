# e-commerce by William Suryawan

# Local Access
#### client site: http://localhost:8080/
#### server site: http://localhost:3000/

### Installation and Getting Started (execute this function to run this app in your terminal)
```sh
$ npm init -y (inside root server folder)
$ npm run dev or nodemon app.js (on terminal inside root server folder)
$ nom run serve (on terminal inside root client folder)
```

### Deploy (BETA Version, some bugs still exist)
```sh
Server: http://35.198.252.114/
Client: http://ecommerce.williamsuryawan.com/
```

### Admin Access
```sh
email: admin@gmail.com
password: 1234
```

### **User Routing**
HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
POST | users/register | body Object <br> example {name: String, email: String, password: String, address: String, city: String, province: String, zipcode: String} | Code: 201 <br> Body: {message: newUser} | Code: 500 <br> Body: {message: internal server error} | register new user to ecommerce and create one cart for this user (one user = one cart)
POST | users/login | body Object <br> example {email: String, password: String, loginVia: 'website'} | Code: 200 <br> Body: {token: token} | Code 400 <b> Body: {msg: wrong email/password} | login via website to ecommerce
GET | users/detail | headers token:**Required** | Code: 200 <br> Body: {message: userDetail} | Code: 500 <br> Body: {message: internal server error} |show one user detail based on token (authenticated user only)
PUT | users/edit | headers token:**Required** <br> body Object <br> example {name: String, email: String, address: String, city: String, province: String, zipcode: String} | Code: 200 <br> Body: {message: updatedUser} | Code: 500 <br> Body: {message: can't edit user} | edit one user (based on information provided on body)

### **Product Routing**

HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
GET | products |  | Code: 200 <br> Body: [{message: product}] | Code: 500 <br> Body: {message: internal server error} |show all  products for all viewers
GET | products/:id |  | params productId <br> Code: 200 <br> Body: {message: product} | Code: 500 <br> Body: {message: internal server error} |show one  products for all viewers (based on product Id)
POST | products/create | body Form Data <br> example {name: String, stock: Number, price: Number, weight: Number, brand: String, category: String, image: file} <br> headers admin token:**Required** | Code: 201 <br> Body: {message: newProduct} | Code: 500 <br> Body: {message: internal server error} |create new product to ecommerce
PUT | products/:id | params productId <br> headers admin token:**Required** <br> body Object <br> example {name: String, stock: Number, price: Number, weight: Number, brand: String, category: String} | Code: 200 <br> Body: {message: updatedProduct} | Code: 500 <br> Body: {message: can't edit product} | edit one product without changing image (based on information provided on body)
DELETE | products/:id | params productId <br> headers admin token:**Required** | Code: 200 <br> Body: {message: deletedTodo} | Code: 500 <br> Body: {message: can't delete product} | delete one product

### **Cart Routing**
HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
GET | carts | headers token:**Required** | Code: 200 <br> Body: {message: carts}  | Code: 500 <br> Body: {message: internal server error} |show the cart of an authenticated customer
POST | carts | body Object <br> example {_id: Number, amount: Number} <br> headers token:**Required** | Code: 200 <br> Body: {message: updatedCart with added product}  | Code: 500 <br> Body: {message: amount more than available stock } | Add product and amount into cart (Authorization: only owner who can add products to his cart)
PUT | carts | body Object <br> example {_id: Number, amount: Number} <br> headers token:**Required** | Code: 200 <br> Body: {message: updatedCart with added product}  | Code: 500 <br> Body: {message: internal server error } | reduce product and amount into cart (Authorization: only owner who can reduce products to his cart)
PUT | carts/empty | headers token:**Required**  |  Code: 200 <br> Body: {message: updatedCart with empty product list}  | Code: 500 <br> Body: {message: internal server error } | remove all product in the cart (Authorization: only owner who can remove all products in his cart)


### **Transaction Routing**
HTTP METHOD | ROUTE | REQUEST | RESPONSE Success | RESPONSE Error | Description
------|------|-----------|------|----------|------------
GET | transactions/all | headers admin token:**Required** | Code: 200 <br> Body: [{message: transactions}]  | Code: 500 <br> Body: {message: internal server error} |show all transaction with all details inside ecommerce (Authorization: only admin who can see all transactions)
GET | transactions/ | headers token:**Required** | Code: 200 <br> Body: [{message: transactions}]  | Code: 500 <br> Body: {message: internal server error} |show all transaction with all details inside ecommerce (Authorization: only owner who can see his own transactions)
GET | transactions/:id | params transactionId <br> headers token:**Required** | Code: 200 <br> Body: {message: transaction}  | Code: 500 <br> Body: {message: internal server error} |show one transaction with all details of a user (Authorization: only owner who can see his own transaction)
POST | transactions/create | headers token:**Required** | Code: 201 <br> Body: {message: newTransaction} | Code: 500 <br> Body: {message: internal server error} | create new transaction inside ecommerce with updated product cost based on products in the cart and delivery cost based on address of customer (Authorization: only owner who can create his own transaction)
PUT | transactions/:id | params transactionId <br> headers token:**Required** <br> body Object <br> example {paymentType: String, transactionStatus: String, deliveryStatus: String, changeAdress: true} | Code: 200 <br> Body: {message: updatedTransaction} | Code: 500 <br> Body: {message: can't edit product} | edit transaction in term of paymentType, transactionStatus, deliveryStatus, address (based on information provided on body), (Authorization: only owner who can edit his own transaction)
DELETE | transactions/:id | params transactionId <br> headers token:**Required** | Code: 200 <br> Body: {message: deletedTodo} | Code: 500 <br> Body: {message: can't delete product} | delete one transaction (Authorization: only owner who can delete his own transaction)
