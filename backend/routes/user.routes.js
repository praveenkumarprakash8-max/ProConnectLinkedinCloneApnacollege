import { Router } from "express";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  myConnections,
  register,
  sentConnectionRequest,
} from "../controllers/usre.controller.js";
import { login } from "../controllers/usre.controller.js";
import multer from "multer";
import { uploadProfilePicture } from "../controllers/usre.controller.js";
import { updateUserProfile } from "../controllers/usre.controller.js";
import { getUserAndProfile } from "../controllers/usre.controller.js";
import { updateProfileData } from "../controllers/usre.controller.js";
import { getAllUserProfiles } from "../controllers/usre.controller.js";
import { downloadResume } from "../controllers/usre.controller.js";
import { getUserProfileAndBasedOnUsername } from "../controllers/usre.controller.js";

// import { sentConnectionRequest } from "../controllers/usre.controller.js";
// import { getConnectionRequests } from "../controllers/usre.controller.js";
// import { myConnections } from "../controllers/usre.controller.js";
// import { acceptConnectionRequest } from "../controllers/usre.controller.js";
import { get } from "mongoose";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

// Define your routes here
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/get_all_user_profiles").get(getAllUserProfiles);
router.route("/user/download_resume").get(downloadResume);
router.route("/user/send_connection_request").post(sentConnectionRequest);
router.route("/user/get_connection_requests").get(getConnectionRequests);
router.route("/user/user_connection_request").get(myConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router
  .route("/user/get_profile_based_on_username")
  .get(getUserProfileAndBasedOnUsername);

export default router;
