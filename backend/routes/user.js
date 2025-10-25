    import express from "express";
    import bcrypt from "bcrypt";
    import jwt from "jsonwebtoken";
    import User from "../models/User.js";

    const router = express.Router();

    // Register
    router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
        return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({ name, email, password: hashedPassword });

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
        });

        // Return user info (excluding password) and token
        res.status(201).json({
        user: { _id: user._id, name: user.name, email: user.email },
        token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    // Login route remains the same
    router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
        });

        res.json({ token, user: { _id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });

    export default router;
