const Comment = require("../models/comment.model.js");

exports.createComment = async (req, res, next) => {
  try {

    const { content, postId, userId } = req.body;
    const { userId: _id } = req.user;

    console.log(userId, _id);

    if (!content || !postId || !userId) {
      return res.status(404).json({ message: "All fields are required", success: false });
    }

    if (userId !== _id) {
      return res.status(403).json({ message: "You are not allowed to post comment", success: false });
    }

    const comment = await Comment.create({ content, postId, userId });

    if (comment) {
      return res.status(200).json({ message: "Comment posted successfully", comment });
    }

  } catch (error) {
    next(error);
  }
};

exports.getComments = async (req, res, next) => {

  try {

    const { postId } = req.params;

    if (!postId) {
      return res.json({ message: "No post id found", success: false });
    }

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    if (comments) {
      return res.json({ message: "comments found", comments });
    }

  } catch (error) {
    next(error);
  }

}
