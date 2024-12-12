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
        userId: req.user.userId
    })

    const savedPost = await post.save();

    res.status(201).json(savedPost);

  } catch (error) {
    next(error);
  }
};
