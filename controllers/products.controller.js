const { Product } = require("../models/Product");

async function getAllProducts(req, res) {
    const products = await Product.find();
    return res.status(200).json(products);
}

async function getProductById(req, res) {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    return res.status(200).json(product);
}

async function createProduct(req, res) {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
}

async function updateProduct(req, res) {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedProduct);
}

async function deleteProduct(req, res) {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).send("Product not found");
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).send("Product deleted");
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
