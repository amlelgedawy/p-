const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: String,
    password: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }
}, {timestamps: true});

const Admin = mongoose.model('Admin', adminSchema);

exports.Admin = Admin;
