import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../../config/utility.js";



export async function signup(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const emailCheck =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailCheck.test(email)) {
      return res
        .status(400)
        .json({ message: "Invalid email format" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    generateToken(newUser._id, res);

    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}



// ... existing imports

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    // ... validation and password check logic ...

    // 1. Generate the token (Ensure your generateToken function returns the token string)
    const token = generateToken(user._id, res);

    // 2. Return the token in the JSON body so the frontend can see it
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: token, // <--- ADD THIS LINE
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// DO THE SAME FOR THE signup FUNCTION


export async function logout(req, res) {
  res.cookie("jwt", "", {
    maxAge: 1,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return res.status(200).json({
    message: "Successfully logged out",
  });
}
