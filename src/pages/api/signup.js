import connectDB from "@/config/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
const handler = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Please enter all fields!" });
    console.log("Please enter all fields!");
    return;
  }
  const user = await User.findOne({ email });
  if (user.length > 0) {
    res.status(400).json({ error: "User already exists!" });
    console.log("User already exists!");
    return;
  }
  const hashedPassword = CryptoJS.AES.encrypt(password, process.env.JWT_SECRET).toString();
  const createdUser = await User.create({
    email,
    password: hashedPassword,
  });
  res.status(201).json({
    success:true,
    id: createdUser._id,
    email: createdUser.email,
    token: genToken(createdUser._id),
  });
};
export default connectDB(handler);