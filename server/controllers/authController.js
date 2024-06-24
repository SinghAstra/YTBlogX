import bcrypt from "bcrypt";
import User from "../models/User.js";

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
    const { username } = req.user;

    // Check if username is provided in the query
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    // Check if user exists in the database
    const user = await User.findOne({ username });
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
