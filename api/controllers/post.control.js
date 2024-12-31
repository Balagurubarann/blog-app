const Post = require("../models/post.model.js");
const { errorHandler } = require("../utils/error.js");

exports.createPost = async (req, res, next) => {
  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return next(errorHandler(403, "You are not allowed to create this post"));
    }

    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace("/[^0-9a-zA-Z]/g", "");

    const post = new Post({
      ...req.body,
      slug: slug,
      userId: req.user.userId,
    });

    const savedPost = await post.save();

    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

exports.getPosts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const order = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: order })
      .skip(startIndex)
      .limit(limit);

    const postCount = await Post.countDocuments();

    const now = new Date();

    const monthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPost = await Post.countDocuments({
      createdAt: { $gte: monthAgo },
    });

    res.status(200).json({
      posts,
      postCount,
      lastMonthPost,
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, category, image, content } = req.body;
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return next(errorHandler(403, "You are not allowed to create this post"));
    }

    if (!postId) {
      return next(errorHandler(400, "No post found"));
    }

    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $set: {
          title,
          category,
          image,
          content
        },
      }, { new: true });

    return res.status(200).json(updatedPost);

  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {

  try {

    const { postId, userId } = req.params;
    const { isAdmin, userId: id } = req.user;

    if (!postId) {
      return next(errorHandler(400, "No Post Found!"));
    }

    console.log(req.user);

    if (!isAdmin || id !== userId) {
      return next(errorHandler(400, "You are not allowed to delete this post"));
    }

    await Post.findByIdAndDelete({ _id: postId });

    return res.status(200).json({ message: "Post deleted Successfully!" });

  } catch (error) {
    next(error);
  }

}
