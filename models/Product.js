const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    collection: String,
    rating: {
        type: Number,
        default: 5
    }
}, {timestamps: true});

const Product = mongoose.model('Product', productSchema);

exports.Product = Product;