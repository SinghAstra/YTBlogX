import express from "express";
import upload from "../config/multer.js";
import {
  fetchUserInfoUsingEmail,
  fetchUserInfoUsingJWTToken,
  loginController,
  registerController,
  sendOTPController,
  verifyOTPController,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", upload.single("picture"), registerController);
router.post("/login", loginController);
router.post("/fetchUserInfo", fetchUserInfoUsingEmail);
router.post("/sendOTP", sendOTPController);
router.post("/verifyOTP", verifyOTPController);

router.get("/", authMiddleware, fetchUserInfoUsingJWTToken);

export default router;
