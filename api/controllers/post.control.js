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
    const limit = req.query.limit || 9;
    const startIndex = req.query.startIndex || 0;
    const order = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { category: req.query.slug }),
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
    const { userId } = req.params;
    const { title, category, image, content } = req.body;
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return next(errorHandler(403, "You are not allowed to create this post"));
    }

    if (!userId) {
      return next(errorHandler(400, "No user id found"));
    }

    if (!req.body.title || !req.body.content) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace("/[^0-9a-zA-Z]/g", "");

    const updatedPost = await Post.findOneAndUpdate(
      { userId },
      {
        $set: {
          title,
          category,
          image,
          content,
          slug
        },
      }, { new: true });

    return res.status(200).json(updatedPost);

  } catch (error) {
    next(error);
  }
};
