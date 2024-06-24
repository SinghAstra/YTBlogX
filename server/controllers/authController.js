import bcrypt from "bcrypt";
import User from "../models/User.js";

export const registerController = async (req, res) => {
  try {
    const { firstName, lastName, email, password, location, occupation } =
      req.body;

    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

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
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });

    // await newUser.save();

    res.status(201).json({ newUser, message: "Registered successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
