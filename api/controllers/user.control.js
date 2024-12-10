const User = require("../models/user.model.js");
const { hashSync } = require('bcryptjs');
const { errorHandler } = require("../utils/error.js");

// 675434add7a42a3feaa0a79c

exports.updateUser = async (req, res, next) => {


    try {

        const { userId } = req.params;
        const { _id } = req.user;
        const { username, password, email, profilePicture } = req.body;

        if (userId === _id) {
            return next(errorHandler(403, "You are not allowed to update this user"));
        }

        if (password) {
            if (password.length < 6) {
                return next(errorHandler(400, "Password must  atleast have 6 characters"));
            }
            password = bcrypt.hashSync(password, 10);
        }

        if (username) {
            if (username.length < 6 || username.length > 20) {
                return next(errorHandler(400, "Username must be between 6 and 20 characters"));
            }
            if (username.includes(" ")) {
                return next(errorHandler(400, "Username cannot contains space"));
            }
            if (!username.match(/^[A-Za-z0-9]+$/)) {
                return next(errorHandler(400, "Username only contains letters and numbers"));
            }
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            $set: {
                username,
                email,
                password,
                profilePicture
            }
        }, { new: true });

        const { password: withoutPassword, ...rest } = updateUser._doc;
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }

}
