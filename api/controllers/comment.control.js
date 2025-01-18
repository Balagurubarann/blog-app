const Comment = require("../models/comment.model.js");

exports.createComment = async (req, res, next) => {
  try {

    const { content, postId, userId } = req.body;
    const { userId: _id } = req.user;

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

exports.editComment = async (req, res, next) => {

  try {

    const { commentId } = req.params;

    const { content } = req.body;

    if (!commentId) {
      return res.json({ message: "No comment found", success: false });
    }

    const updatedComment = await Comment.findByIdAndUpdate({ _id: commentId }, {
      $set: {
        content
      }
    },  { new: true });

    return res.status(200).json({ message: "Comment Updated", success: true, updatedComment });

  } catch (error) {
    next(error);
  }

}
