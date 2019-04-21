const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema ({
    listsProduct: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Productlist'
            },
        qty: {type: Number}
    }],
    userId: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }
})


const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;