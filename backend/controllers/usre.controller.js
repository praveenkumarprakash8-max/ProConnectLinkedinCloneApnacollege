import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
// import pkg from "mongoose";
import Connection from "../models/connection.model.js";

const convertUserDataToPDF = (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image(`uploads/${userData.userid.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userid.name}`);
  doc.fontSize(14).text(`username: ${userData.userid.username}`);
  doc.fontSize(14).text(`Email: ${userData.userid.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio}`);
  doc.fontSize(14).text(`Current Post: ${userData.currentPost}`);
  doc.fontSize(14).text("Past Work:");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(` Company Name: ${work.company}`);
    doc.fontSize(14).text(` Position: ${work.position}`);
    doc.fontSize(14).text(` Years: ${work.years}`);
  });
  doc.fontSize(14).text("Education:");
  userData.education.forEach((edu, index) => {
    doc.fontSize(14).text(` School: ${edu.school}`);
    doc.fontSize(14).text(` Degree: ${edu.degree}`);
    doc.fontSize(14).text(` Field Of Study: ${edu.fieldOfStudy}`);
  });
  doc.end();
  return outputPath;
};

export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "user already exists" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    const profile = new Profile({
      userid: newUser._id,
    });
    await profile.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token });

    return res.status(200).json({ token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = req.file.filename;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error message" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser && String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "User  updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const token = req.query.token || req.body.token;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile = await Profile.findOne({ userid: user._id }).populate(
      "userid",
      "name email username profilePicture coverPicture",
    );
    return res.status(200).json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;
    const user = await User.findOne({ token: token });
    const userProfile = await Profile.findOne({ userid: user._id });

    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const profile_to_update = await Profile.findOne({
      userid: userProfile.userid,
    });

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();
    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const getAllUserProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userid",
      "name email username profilePicture coverPicture",
    );
    return res.status(200).json({ profiles });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const user_id = req.query.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userProfile = await Profile.findOne({ userid: user_id }).populate(
      "userid",
      "name email username profilePicture coverPicture",
    );

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    const outputPath = convertUserDataToPDF(userProfile);
    return res.status(200).json({ message: outputPath });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: " error message" });
  }
};

export const sentConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await Connection.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Connection request already sent" });
    }

    const request = new Connection({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    await request.save();

    return res
      .status(200)
      .json({ message: "Connection request sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: " error message" });
  }
};

export const getConnectionRequests = async (req, res) => {
  const token = req.query.token || req.body?.token;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await Connection.find({
      $or: [{ userId: user._id }, { connectionId: user._id }],
    })
      .populate("connectionId", "name email username profilePicture")
      .populate("userId", "name email username profilePicture");
    return res.json({ connections });
  } catch (error) {
    return res.status(500).json({ message: " error message" });
  }
};

export const myConnections = async (req, res) => {
  const token = req.query.token || req.body?.token;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connections = await Connection.find({
      connectionId: user._id,
    })
      .populate("userId", "name email username profilePicture")
      .populate("connectionId", "name email username profilePicture");
    return res.json(connections);
  } catch (error) {
    return res.status(500).json({ message: " error message" });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  const { token, connectionId, accept_type } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const connection = await Connection.findOne({ _id: connectionId });
    if (!connection) {
      return res.status(404).json({ message: "Connection not found" });
    }

    if (accept_type === "accepted") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }
    await connection.save();
    return res.json({ message: "Request updated" });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const commentPost = async (req, res) => {
  const { token, post_id, commentBody } = req.body;
  try {
    const user = await User.findOne({ token: token }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const post = await Post.findOne({
      _id: post_id,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      userid: user._id,
      postid: post_id,
      body: commentBody,
    });

    await comment.save();
    return res.status(200).json({ message: "comment added" });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};

export const getUserProfileAndBasedOnUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userid: user._id }).populate(
      "userid",
      "name email username profilePicture coverPicture",
    );
    return res.status(200).json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: "error message" });
  }
};
