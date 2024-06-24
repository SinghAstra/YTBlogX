import express from "express";
import upload from "../config/multer.js";
import { registerController } from "../controllers/authController.js";
const router = express.Router();

router.post("/register", upload.single("picture"), registerController);

export default router;
