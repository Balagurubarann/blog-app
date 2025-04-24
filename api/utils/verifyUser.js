const JWT = require("jsonwebtoken");
const { errorHandler } = require("./error.js");
require("dotenv").config();

exports.verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return next(errorHandler(401, "Unauthorized"));
    }

    JWT.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return next(errorHandler(401, "Unauthorized"));
      }
      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
