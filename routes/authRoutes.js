const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { redirectIfLoggedIn } = require("../middleware/authMiddleware");
const router = express.Router();
/* =========================
   SIGNUP API
========================= */
router.post("/signup",async (req, res) => {
        try {
            const {name,email,password,confirmPassword} = req.body;
            /* Validation */
            if (
                !name ||
                !email ||
                !password ||
                !confirmPassword
            ) {
                return res.status(400).json({
                    success: false,
                    message:"Please fill all fields"
                });
            }
            if (
                password !== confirmPassword
            ) {
                return res.status(400).json({
                    success: false,
                    message:"Passwords do not match"
                });
            }
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message:"Password must be at least 6 characters"
                });
            }
            /* Check existing user */
            const existingUser =await User.findOne({
                    email:email.toLowerCase()
                });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message:"User already exists"
                });
            }
            /* Hash password */
            const hashedPassword = await bcrypt.hash(
                password,
                12
            );
            /* Create user */
            const newUser = new User({
                    name: name.trim(),
                    email:email.toLowerCase().trim(),
                    password:hashedPassword
                });
            await newUser.save();
            /* Session */
            req.session.userId =newUser._id;
            req.session.user = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            };
            /* Response */
            res.status(201).json({
                success: true,
                message:"Signup successful",
                user: req.session.user
            });
        } catch (err) {
            console.error("Signup Error:",err);
            res.status(500).json({
                success: false,
                message:"Server error"
            });
        }
    }
);
/* =========================
   LOGIN API
========================= */
router.post("/login", async (req, res) => {
    try {
        const {email,password} = req.body;
        /* Validation */
        if (
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:"Please fill all fields"
            });
        }
        /* Find user */
        const user =await User.findOne({
                email:email.toLowerCase()
            });
        if (!user) {
            return res.status(400).json({
                success: false,
                message:"Invalid email or password"
            });
        }
        /* Compare password */
        const isValidPassword =
            await bcrypt.compare(
                password,
                user.password
            );
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message:"Invalid email or password"
            });
        }
        /* Session */
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };
        /* Response */
        res.status(200).json({
            success: true,
            message:"Login successful",
            user: req.session.user
        });
    } catch (err) {
        console.error("Login Error:",err);
        res.status(500).json({
            success: false,
            message:"Server error"
        });
    }
}
);
/* =========================
   LOGOUT API
========================= */
router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({
                success: false,
                message:"Logout failed"
            });
        }
        res.clearCookie("connect.sid");
        res.json({
            success: true,
            message:"Logged out successfully"
        });
    });
}
);
/* =========================
   CURRENT USER
========================= */
router.get("/me", (req, res) => {
    if (
        !req.session ||
        !req.session.userId
    ) {
        return res.status(401).json({
            loggedIn: false
        });
    }
    res.json({
        loggedIn: true,
        user: req.session.user
    });
}
);
module.exports = router;