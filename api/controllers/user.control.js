const User = require("../models/user.model.js");
const { hashSync } = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { userId: id } = req.user;
    const { username, password, email, profilePicture } = req.body;

    if (userId !== id) {
      return next(errorHandler(403, "You are not allowed to update this user"));
    }

    if (password) {
      if (password.length < 6) {
        return next(
          errorHandler(400, "Password must  atleast have 6 characters")
        );
      }
      password = hashSync(password, 10);
    }

    if (username) {
      if (username.length < 6 || username.length > 20) {
        return next(
          errorHandler(400, "Username must be between 6 and 20 characters")
        );
      }
      if (username.includes(" ")) {
        return next(errorHandler(400, "Username cannot contains space"));
      }
      if (!username.match(/^[A-Za-z0-9]+$/)) {
        return next(
          errorHandler(400, "Username only contains letters and numbers")
        );
      }
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          email,
          password,
          profilePicture,
        },
      },
      { new: true }
    );

    const { password: withoutPassword, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { userId: id } = req.user;

    console.log(userId, id);

    if (id !== userId) {
      return next(errorHandler(403, "You are not allowed to delete this user"));
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json("User has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

