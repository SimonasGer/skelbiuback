const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords do not match",
        },
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpire: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
})

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
  });

userSchema.methods.correctPassword = async (
    candidatePassword,
    userPassword) => {
        return await bcrypt.compare(candidatePassword, userPassword)
    };

userSchema.methods.changePasswordAfter = function (JwtTimestamp){
    if (this.passwordChangedAt){
        const changeTimeStamp = parseInt(
        this.passwordChangedAt.getTime() / 1000, 10
        );
    return JwtTimestamp < changeTimeStamp;
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;