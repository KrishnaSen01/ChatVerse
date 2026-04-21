import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(404)
        .json({
          message:
            "req.body is empty, please pass the fullName, email, password all required",
        });
    }

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(404)
        .json("all fields(fullName, email, password) are required");
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "password must be atleast of 6 characters;",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "user already exist with this email" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });

    if (newUser) {
      //create user token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("err in signup: ", error, "end");

    return res.json({
      message: "err in signup",
      err: error.message,
    });
  }
};

//login

export const login = async (req, res) => {
  console.log("req from login :- ",req);
  
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email, password both are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({message: "Invalid credentials "});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log("run before pass check");
    
    if (!isPasswordCorrect) {
      return res.status(400).json({message: "Invalid credentials "});
    }

    console.log("run after pass check");

    const token = generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("error in login is :- ", err);
    return res.status(500).json({
      message: "error in login",
      err: err.message,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    console.log("logged out run successfully");//
    
    res.status(200).json({
      message: "logged out successfull",
    });
  } catch (error) {
    console.log("error in logout controller, ", error.message); 
    return res.status(500).json({
      message: "Internal server error",
      err: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "profile picture is required" });
    }

    const uploadedResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedResponse.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("error in updateProfile is :- ", err);
    return res.status(500).json({
      message: "err in updateProfile",
      err: err.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    console.log("error in checkAuth controller :- ", err.message);
    return res.status(500).json({
      message: "Internal server error",
      err: err.message,
    });
  }
};
