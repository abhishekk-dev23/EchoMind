import { generateToken } from "../lib/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import cloudinary from "../lib/cloudinary.js";
import { Http2ServerRequest } from "http2";

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;

    try {
        if (!email || !password || !fullName) {
            return res
                .status(400)
                .json({ success: false, message: "Missing Details" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({
                success: false,
                message: "Account already exits",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashPassword,
        });

        const token = generateToken(newUser._id);

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        newUser.password = undefined;

        res.status(201).json({
            success: true,
            userData: newUser,
            message: "Account created successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing Details",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid Credentials" });
        }

        const token = generateToken(user._id);

        // Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        user.password = undefined;

        res.status(201).json({
            success: true,
            user,
            token,
            message: "Login successful",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0),
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Error during logout",
        });
    }
};

export const checkAuth = (req, res) => {
    res.status(201).json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
    try {
        const { fullName, profilePic } = req.body;
        const userId = req.user._id;

        let updateUser;
        if (!profilePic) {
            updateUser = await User.findByIdAndUpdate(
                userId,
                { fullName },
                { new: true }
            ).select("-password");
        } else {
            const upload = await cloudinary.uploader.upload(profilePic);

            updateUser = await User.findByIdAndUpdate(
                userId,
                { profilePic: upload.secure_url, fullName },
                { new: true }
            ).select("-password");
        }

        res.status(201).json({ success: true, user: updateUser });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            success: false,
            message: "Error while updating profile...",
        });
    }
};
