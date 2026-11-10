const Post = require("../models/postModel");
const { cloudinary } = require("../utils/cloudinary");

const notifyFriends = require("../utils/notifyFriends");
const createNotification = require("../utils/createNotification");

// ======================================
// CREATE POST
// ======================================

const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if ((!content || !content.trim()) && !req.file) {
      return res.status(400).json({
        message: "Please provide content or an image.",
      });
    }

    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "educonnect/postImage",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result);
          },
        );

        uploadStream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const newPost = await Post.create({
      author: req.user.userId,
      content: content || "",
      image: imageUrl,
    });

    // Notify accepted friends about the new post
    await notifyFriends({
      userId: req.user.userId,
      type: "new_post",
      message: "shared a new post",
      referenceId: newPost._id,
      referenceModel: "Post",
      io: req.app.get("io"),
    });

    const populatedPost = await Post.findById(newPost._id)
      .populate("author", "fullName email role profilepic")
      .populate("comments.user", "fullName profilepic");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    });
  }
};

// ======================================
// GET ALL POSTS
// ======================================

const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "fullName email role profilepic")
      .populate("comments.user", "fullName profilepic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);

    return res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

// ======================================
// GET ONE POST
// ======================================

const getOnePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const onePost = await Post.findById(postId)
      .populate("author", "fullName email role profilepic")
      .populate("comments.user", "fullName profilepic");

    if (!onePost) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      onePost,
    });
  } catch (error) {
    console.error("Error finding post:", error);

    return res.status(500).json({
      message: "Failed to get the post",
      error: error.message,
    });
  }
};

// ======================================
// UPDATE POST
// ======================================

const updatePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Content is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    post.content = content.trim();
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("author", "fullName email role profilepic")
      .populate("comments.user", "fullName profilepic");

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return res.status(500).json({
      message: "Failed to update the post",
      error: error.message,
    });
  }
};

// ======================================
// GET MY OWN POSTS
// ======================================

const getMyfeed = async (req, res) => {
  try {
    const userId = req.user.userId;

    const posts = await Post.find({ author: userId })
      .populate("author", "fullName email role profilepic")
      .populate("comments.user", "fullName profilepic")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Your posts fetched successfully",
      posts,
    });
  } catch (error) {
    console.error("Error getting own feed:", error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ======================================
// DELETE POST
// ======================================

const deletePost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    await post.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    return res.status(500).json({
      message: "Failed to delete the post",
      error: error.message,
    });
  }
};

// ======================================
// LIKE / UNLIKE POST
// ======================================

const likeUnlike = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === userId.toString(),
    );

    // UNLIKE
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        liked: false,
        likes: post.likes,
      });
    }

    // LIKE
    post.likes.push(userId);
    await post.save();

    // Notify post author when another user likes the post
    await createNotification({
      recipient: post.author,
      sender: userId,
      type: "new_like",
      message: "liked your post",
      referenceId: post._id,
      referenceModel: "Post",
      io: req.app.get("io"),
    });

    return res.status(200).json({
      success: true,
      message: "Post liked successfully",
      liked: true,
      likes: post.likes,
      post,
    });
  } catch (error) {
    console.error("Like/unlike error:", error);

    return res.status(500).json({
      message: "Failed to process like",
      error: error.message,
    });
  }
};

// ======================================
// ADD COMMENT
// ======================================

const addComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    post.comments.push({
      user: userId,
      text: text.trim(),
    });

    await post.save();

    // Notify post author when another user comments
    await createNotification({
      recipient: post.author,
      sender: userId,
      type: "new_comment",
      message: "commented on your post",
      referenceId: post._id,
      referenceModel: "Post",
      io: req.app.get("io"),
    });

    const updatedPost = await Post.findById(postId)
      .populate("author", "fullName email role profilepic")
      .populate("comments.user", "fullName profilepic");

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Add comment error:", error);

    return res.status(500).json({
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

// ======================================
// DELETE COMMENT
// ======================================

const deleteComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
      });
    }

    comment.deleteOne();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};

// ======================================
// EXPORT CONTROLLERS
// ======================================

module.exports = {
  createPost,
  getAllPost,
  getOnePost,
  updatePost,
  deletePost,
  likeUnlike,
  addComment,
  deleteComment,
  getMyfeed,
};
