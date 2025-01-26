const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const commentSchema = new Schema({

    content: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true,
    },

    postId: {
        type: String,
        required: true
    },

    likedUsers: {
        type: Array,
        default: []
    },

    likeNos: {
        type: Number,
        default: 0
    },

    disLikedUsers: {
        type: Array, 
        default: []
    },

    disLikedNos: {
        type: Number
    }

}, { timestamps: true });

const Comment = model("Comment", commentSchema);

module.exports = Comment;
