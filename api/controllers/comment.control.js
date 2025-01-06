const Comment = require("../models/comment.model.js");

exports.createComment = async (req, res, next) => {
  try {

    const {  } = req.body;
    const {  } = req.user;

  } catch (error) {
    next(error);
  }
};
