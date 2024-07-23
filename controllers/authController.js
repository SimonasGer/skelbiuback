const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

exports.register = async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.status(201).json({
            status: "success",
            data: newUser,
            token,
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message,
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error("Please provide email and password");
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new Error("Incorrect password or email");
        }
        const token = signToken(user.id);
        res.status(201).json({
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: err.message,
        })
    }
}

exports.protect = async (req, res, next) => {
    try {
        // 1. Get token:
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token){
            throw new Error("User not authenticated");
        }
        // 2. Verify token:
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        // 3. Check if user exists:
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            throw new Error("User does not exist");
        }
        // 4. Check if user changed pw:
        if (currentUser.changePasswordAfter(decoded.iat)) {
            throw new Error("User changed password; token is invalid");
        }
        // Grant access:
        req.user = currentUser;
        next();
    } catch (err) {
        res.status(400).json({
            status: "failed",
            error: err.message,
        })
    }
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: "failed",
                message: "You do not have permissions for this action",
            });
        } else {
            next();
        }
    }
}