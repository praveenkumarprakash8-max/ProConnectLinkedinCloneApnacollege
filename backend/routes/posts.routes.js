import { Router } from "express";
import {
  activeCheck,
  createPost,
  deleteCommentOfUser,
  deletePost,
  getAllPost,
  getCommentByPost,
  incrementLikes,
} from "../controllers/post.controller.js";
import multer from "multer";
import { commentPost } from "../controllers/usre.controller.js";

const router = Router();

// Define your routes here
router.route("/").get(activeCheck);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/post").post(upload.single("media"), createPost);

router.route("/posts").get(getAllPost);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comment").post(getCommentByPost);
router.route("/delete_comment").delete(deleteCommentOfUser);
router.route("/increment_like").post(incrementLikes);

export default router;
