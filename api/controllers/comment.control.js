const Comment = require("../models/comment.model.js");

exports.createComment = async (req, res, next) => {
  try {

    const { content, postId, userId } = req.body;
    const { userId: _id } = req.user;

    console.log(userId, _id);

    if (userId != _id) {
      return res.json({ message: "You are not allowed to post comment", success: false });
    }

    const comment = await Comment.create({ content, postId, userId });

    if (comment) {
      return res.json({ message: "Comment posted successfully", comment });
    }

  } catch (error) {
    next(error);
  }
};
