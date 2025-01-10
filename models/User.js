const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    email: String,
    password: String,
    wishlist: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Product",
        default: []
    },
    orders: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Order",
        default: []
    },
    cart: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Product",
        default: []
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

exports.User = User;