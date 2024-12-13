const User = require("../models/user.model.js");
const { hashSync, compare } = require("bcryptjs");
const { errorHandler } = require("../utils/error.js");
const JWT = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    if (
      !username ||
      !password ||
      !email ||
      username === "" ||
      password === "" ||
      email === ""
    ) {
      next(errorHandler(400, "All fields are required"));
    }

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      next(errorHandler(400, "User's email already exists"));
    }

    if (existingUsername) {
      next(errorHandler(400, "User's name must be unique"));
    }

    const hashedPassword = hashSync(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
    });

    await user.save();

    const token = JWT.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const { password: pass, ...rest } = user._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"? "none": "strict"
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "All fields are required!"));
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(errorHandler(404, "User not found"));
    }

    const authUser = await compare(password, existingUser.password);

    if (!authUser) {
      return next(errorHandler(400, "Invalid Password"));
    }

    const token = JWT.sign(
      { userId: existingUser._id, isAdmin: existingUser.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    const { password: pass, ...rest } = existingUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production"? "none": "strict"
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

exports.googleAuth = async (req, res, next) => {
  try {
    const { name, email, googlePhotoUrl } = req.body;

    if (!name || !email || name === "" || email === "") {
      next(errorHandler(400, "All fields are required"));
    }

    const user = await User.findOne({ email });

    if (user) {
      const token = JWT.sign(
        { userId: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY
      );

      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();
      const token = JWT.sign(
        { userId: newUser._id, isAdmin: newUser.isAdmin },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          maxAge: 60 * 60 * 1000 * 24,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
