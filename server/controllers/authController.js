import bcrypt from "bcrypt";
import crypto from "crypto";
import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import userAgentParser from "user-agent-parser";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing Credentials." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let picturePath = "";
    if (req.file) {
      picturePath = req.file.path;
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, message: "Registered successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const fetchUserInfoUsingJWTToken = async (req, res) => {
  try {
    const { email } = req.user;

    // Check if email is provided in the query
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract non-sensitive user data to return
    const { password, ...rest } = user.toObject(); // Convert Mongoose document to plain JS object
    const userData = Object.assign({}, rest);

    res.json({ user: userData, message: "User Info fetched" });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching user Info." });
  }
};

export const fetchUserInfoUsingEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided in the request body
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract non-sensitive user data to return
    const { password, ...nonSensitiveUserData } = user.toObject(); // Convert Mongoose document to plain JS object

    res.json({
      user: nonSensitiveUserData,
      message: "User Info fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error while fetching user info." });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check if user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token and user information
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error while logging in" });
  }
};

export const sendOTPController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email });
  try {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const userAgentString = req.headers["user-agent"];
    const parsedUserAgent = userAgentParser(userAgentString);

    const browser =
      parsedUserAgent.browser.name + " " + parsedUserAgent.browser.version;
    const os = parsedUserAgent.os.name + " " + parsedUserAgent.os.version;

    const templatePath = path.resolve(
      __dirname,
      "../email-templates/resetPassword.html"
    );
    let html = fs.readFileSync(templatePath, "utf8");

    html = html.replace(/{{username}}/g, user.firstName);
    html = html.replace(/{{OTP}}/g, otp);
    html = html.replace(/{{operatingSystem}}/g, os);
    html = html.replace(/{{browser}}/g, browser);

    console.log("html is ", html);

    // Send email
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      html: html,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log("error is ", error);
    console.log("error.message is ", error.message);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Error sending email" });
  }
};

export const verifyOTPController = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      hashedOtp !== user.resetPasswordToken ||
      Date.now() > user.resetPasswordExpire
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.isOtpVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP" });
  }
};

export const resetPasswordController = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isOtpVerified) {
      return res.status(400).json({ message: "OTP not verified" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the OTP verification flag
    user.isOtpVerified = false;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password" });
  }
};

export const testController = (req, res) => {
  console.log(`Browser: ${browser}, OS: ${os}`);
  console.log("__dirname is ", __dirname);

  const templatePath = path.resolve(
    __dirname,
    "../email-templates/resetPasswordTemplate.html"
  );

  console.log("templatePath is ", templatePath);
  res.json({ message: "SocialNet Server is running." });
};
