const mongoose = require("mongoose");
const { type } = require("os");
const dishSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    day: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6, 7],
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    created_at: {
        type: Date,
        default: Date.now(),
        select: false,
    },
})


const Dish = mongoose.model("Dish", dishSchema);
module.exports = Dish;