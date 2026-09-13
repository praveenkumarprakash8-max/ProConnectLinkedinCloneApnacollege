import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
export const activeCheck = async (req, res) => {
  return res.status(200).json({ message: "Active" });
};

export const createPost = async (req, res) => {
  try {
    const { token, body } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const post = new Post({
      userid: user._id,
      body: body || "",
      media: req.file ? req.file.filename : "",
      fileType: req.file ? req.file.mimetype.split("/")[1] : "",
    });

    await post.save();
    return res.status(200).json({ message: "Post created" });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find().populate(
      "userid",
      "name username email profilePicture",
    );
    return res.json({ posts });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const deletePost = async (req, res) => {
  const { token, post_id } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const post = await Post.findOne({ _id: post_id });

    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    if (post.userid.toString() !== user._id.toString()) {
      return res.status(404).json({ message: "Unauthorized" });
    }

    await Post.deleteOne({ _id: post_id });
    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const getCommentByPost = async (req, res) => {
  const post_id = req.body.post_id || req.query.post_id;
  // console.log("post_id", post_id);
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const comments = await Comment.find({ postid: post_id })
      .populate("userid", "name username profilePicture")
      .sort({ _id: -1 });

    return res.json(comments);
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const deleteCommentOfUser = async (req, res) => {
  const { token, comment_id } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "user not found" }).select("_id");
    }

    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }

    if (comment.userid.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteOne({ _id: comment_id });
    return res.json({ message: "comment deleted" });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const incrementLikes = async (req, res) => {
  const { post_id } = req.body;
  try {
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    // Agar likes undefined/null hai toh 0 lega, fir + 1 karega
    post.likes = (post.likes || 0) + 1;
    await post.save();

    return res.json({ message: "Likes incremented" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
