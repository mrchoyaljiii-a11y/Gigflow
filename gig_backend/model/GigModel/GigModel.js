const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GigModel = new Schema({
    bid: {type: Number, required: true},
    timeline: {type: String, required: true},
    freelancerId: {type: String, required: true},
    gigId: {type: String, required: true},
    description: {type: String, required: true},
})

module.exports = mongoose.model('Bid', GigModel);