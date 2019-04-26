const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hashPassword = require('../helpers/hashPassword')

const userSchema = new Schema ({
    name: {
        type: String
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: [{
            validator: function (value) {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(value); // Assuming email has a text attribute
            },
            message: props => 'Email in wrong format'
        },{
            isAsync: true,
            validator: function (value, cb) {
                User.find({email: value}, function (err, members) {
                    // console.log("masuk validator email", value, members)
                    if(members.length > 0) {
                        cb(false)
                    } else {
                        cb(true)
                    }
                })
            },
            message: props => 'Email already exists'
        }]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [3, "Password can't be less than 3 characters"]
    },
    role: {
        type: String,
        required: [true, "role can't be empty"]
    },
    address: {
        type: String
    },
    city: {
        type: String,
        required: [true, "city can't be empty"]
    },
    province: {
        type: String
    },
    zipcode: {
        type: String
    }
});

userSchema.pre('save', function(next) {
    console.log("masuk hook hash password")
    if(this.password) { 
        this.password = hashPassword(this.password)
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;