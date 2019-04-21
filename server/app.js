require('dotenv').config();
const express = require('express');
const app = express();
const cors = require ('cors')
const mongoose = require('mongoose');

app.use(cors())
// mongoose.connect(`mongodb://localhost/ecommerce-r-${process.env.NODE_ENV}`, { useNewUrlParser: true });
mongoose.connect(`mongodb+srv://${process.env.name}:${process.env.password}@cluster0-dlbfv.mongodb.net/ecommerce?retryWrites=true`, {useNewUrlParser: true})

// const index = require('./routes/index');
const userRouter = require('./routes/users')
const productRouter = require('./routes/products')
const cartRouter = require('./routes/carts')
const transactionRouter = require('./routes/transactions')
const port = process.env.port || 3000


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/', index);
app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/carts', cartRouter)
app.use('/transactions', transactionRouter)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

module.exports = app;