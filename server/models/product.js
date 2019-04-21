const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema ({
    name: {
        type: String,
        required: [true, "name can't be empty"],
    },
    stock: {
        type: String,
        required: [true, "stock can't be empty"],
    },
    price: {
        type: String,
        required: [true, "price can't be empty"],
    },
    weight: {
        type: String,
        required: [true, "weight can't be empty"],
    },
    link: {
        type: String
    },
    brand: {
        type: String,
        required: [true, "brand can't be empty"],
    },
    category: {
        type: String,
        required: [true, "category can't be empty"],
    },
    productuserid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Productlist = mongoose.model('Productlist', ProductSchema)

module.exports = Productlist