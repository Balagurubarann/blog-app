const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 30
    },

    password: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    profilePicture: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg"
    },

    isAdmin: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const User = model("User", UserSchema);

module.exports = User;
