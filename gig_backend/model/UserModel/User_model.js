const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    
    password: { type: String, required: true,trim:true }

}, { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);