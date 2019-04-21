const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema ({
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
    },
    totalWeight: {
        type: Number
    },
    productCharge: {
        type: Number
    },
    deliveryCharge: {
        type: Number
    },
    totalCharge: {
        type: Number
    },
    transactionStatus: {
        type: String
    },
    paymentType: {
        type: String
    },
    deliveryStatus: {
        type: String
    }
})


const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;