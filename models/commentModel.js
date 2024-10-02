const mongoose = require("mongoose");
const { type } = require("os");
const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    comments: {
        type: Array,
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Comment',
    },
    post: {
        type: mongoose.Schema.Types.ObjectId, ref: "Post",
    },
    created_at: {
        type: Date,
        default: Date.now(),
        select: false,
    },
})


const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;