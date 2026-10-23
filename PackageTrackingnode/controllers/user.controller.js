const UserModel = require("../models/user.model");
const PackageModel = require("../models/package.model");
const TrackingModel = require("../models/trackinghistory.model");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("node:crypto");
const { data } = require("react-router-dom");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

const registerUser = async (req, res) => {
  const {
    firstname,
    lastname,
    password,
    email,
    tag,
    // isVerified,
    // verificationToken,
    // resetPasswordToken,
    // resetPasswordExpires,
  } = req.body;
  try {
    const saltround = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(password, saltround);

    // const number = `${Math.ceil(Math.random() * 10000000)}`.padStart(7, "0")
    // const generatedAccount = `AUG${number}`

    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashPass,
      // isVerified,
      // verificationToken,
      // resetPasswordToken,
      // resetPasswordExpires
    });

    const token = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h", algorithm: "HS256" },
    );

    let mailOptions = {
      from: process.env.APP_EMAIL,
      // to: 'Tipheisaac007@gmail.com',
      to: email,
      subject: `Welcome to Delivery Express ${firstname}`,
      text: `Welcome to Delivery Express, where delivery is made easy`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).send({
      message: "user created successfully",
      data: {
        firstname,
        lastname,
        email,
        token,
        role: user.role,
        tag: tag ? tag : null,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({
        message: "Email or tag already exists",
      });
    } else {
      console.log(error);

      res.status(400).send({
        message: "User cannot be created at this time",
      });
    }
  }
};

const registerAdmin = async (req, res) => {
  const { firstname, lastname, password, email, tag } = req.body;
  try {
    const saltround = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(password, saltround);

    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashPass,
      role: "admin",
    });

    const token = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m", algorithm: "HS256" },
    );

    res.status(201).send({
      message: "Admin created successfully",
      data: {
        firstname,
        lastname,
        email,
        role: user.role,
        tag: tag ? tag : null,
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({
        message: "Admin already exists",
      });
    } else {
      console.log(error);

      res.status(400).send({
        message: "Admin cannot be created at this time",
      });
    }
  }
};

const registerDriver = async (req, res) => {
  const { firstname, lastname, password, email, tag } = req.body;
  try {
    const saltround = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(password, saltround);

    const user = await UserModel.create({
      firstname,
      lastname,
      email,
      password: hashPass,
      role: "driver",
    });

    const token = await jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10m", algorithm: "HS256" },
    );

    res.status(201).send({
      message: "Driver created successfully",
      data: {
        firstname,
        lastname,
        email,
        role: user.role,
        tag: tag ? tag : null,
        token,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send({
        message: "Driver already exists",
      });
    } else {
      console.log(error);

      res.status(400).send({
        message: "Driver cannot be created at this time",
      });
    }
  }
};

const getUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await UserModel.findById(id);

    if (!user) {
      res.status(400).send({
        message: "User not found",
      });
    }

    res.status(200).send({
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);

    res.status(404).send({
      message: "User cannot be fetched at this time",
    });
  }
};

const getAdmin = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      message: "Forbidden resource",
    });
  }

  const { id } = req.user;
  try {
    const admin = await UserModel.findById(id);

    if (!admin) {
      return res.status(404).send({
        message: "Admin not found",
      });
    }

    return res.status(200).send({
      message: "Admin profile fetched successfully",
      data: admin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "Server error",
    });
  }
};

const getDriver = async (req, res) => {
  if (req.user.role !== "driver") {
    return res.status(403).send({
      message: "Forbidden resource",
    });
  }

  const { id } = req.user;
  try {
    const driver = await UserModel.findById(id);

    if (!driver) {
      return res.status(404).send({
        message: "Driver not found",
      });
    }

    return res.status(200).send({
      message: "Driver profile fetched successfully",
      data: driver,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      message: "Server error",
    });
  }
};

const getUserByAdmin = async (req, res) => {
  const { id, role } = req.user;
  console.log(role);

  const { userId } = req.params;
  try {
    if (role !== "admin" && role !== "operator") {
      res.status(403).send({
        message: "Forbidden resource",
      });
      return;
    }

    const user = await UserModel.findById(userId).populate("accountNumber");

    if (!user) {
      console.log(error);

      res.status(400).send({
        message: "User not found",
      });
      return;
    }
    res.status(200).send({
      message: "User profile fetched successfully",
      date: user,
    });
  } catch (error) {
    console.log(error);

    res.status(404).send({
      message: "User profile cannot be fetched at this time",
    });
  }
};

const getUsersByRole = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({ message: "Forbidden resource" });
  }

  const { role } = req.query;
  if (!["user", "driver"].includes(role)) {
    return res.status(400).send({ message: "A valid user role is required" });
  }

  try {
    const users = await UserModel.find({ role }).sort({ createdAt: -1 });
    return res.status(200).send({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).send({ message: "Unable to load users" });
  }
};

const deleteUser = async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send({
    message: "Forbidden resource" });
  }

  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).send({
    message: "Invalid user ID" });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).send({ 
        message: "User not found" });
    }

    if (!["user", "driver"].includes(user.role)) {
      return res
        .status(403).send({ 
        message: "Admin accounts cannot be deleted" });
    }

    await PackageModel.updateMany(
      { sender: user._id },
      { $unset: { sender: 1 } },
    );
    await PackageModel.updateMany(
      { receiver: user._id },
      { $unset: { receiver: 1 } },
    );
    await PackageModel.updateMany(
      { assignedDriver: user._id },
      { $set: { assignedDriver: null } },
    );
    await TrackingModel.updateMany(
      { updatedBy: user._id },
      { $unset: { updatedBy: 1 } },
    );

    await UserModel.findByIdAndDelete(user._id);

    return res.status(200).send({
      success: true,
      message: `${user.role === "driver" ? "Driver" : "User"} deleted successfully`,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).send({
    message:"Unable to delete user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isUser = await UserModel.findOne({ email }).select("+password");

    if (!isUser) {
      res.status(400).send({
        message: "Account does not exist",
      });

      return;
    }

    const isMatch = await bcryptjs.compare(password, isUser.password);
    if (!isMatch) {
      res.status(400).send({
        message: "Invalid credentials",
      });

      return;
    }

    // const userData = isUser.toObject();
    // delete userData.password;
    const token = jwt.sign(
      { id: isUser._id, role: isUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
        algorithm: "HS256",
      },
    );

    // res.status(201).send({
    //     message: "Login successful",
    //     data: {
    //         firstname: isUser.firstname,
    //         lastname: isUser.lastname,
    //         email: isUser.email,
    //         token,
    //     },
    // });
    res.status(200).send({
      message: "Login Successful",
      data: {
        firstname: isUser.firstname,
        lastname: isUser.lastname,
        email: isUser.email,
        token,
        tag: isUser.tag ? isUser.tag : null,
        role: isUser.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      message: "Invalid credentials",
    });
  }
};

const requestPasswordReset = async (req, res) => {
  const email =
    typeof req.body.email === "string" ? req.body.email.trim() : "";

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
      await user.save();

      const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
      try {
        await transporter.sendMail({
          from: process.env.APP_EMAIL,
          to: user.email,
          subject: "Reset your Delivery Express password",
          text: `Use this link to reset your password within one hour: ${resetUrl}`,
        });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        throw error;
      }
    }

    return res.status(200).send({
      message: "If an account exists for that email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Password reset request failed:", error);
    return res.status(500).send({
      message: "Unable to send a reset link right now. Please try again later.",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (
    typeof password !== "string" ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    )
  ) {
    return res.status(400).send({
      message:
        "Password must have at least 8 characters, including uppercase, lowercase, number and special character.",
    });
  }

  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await UserModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).send({
        message: "This password reset link is invalid or has expired.",
      });
    }

    user.password = await bcryptjs.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).send({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).send({
      message: "Unable to reset your password right now. Please try again later.",
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isAdmin = await UserModel.findOne({ email }).select("+password");

    if (!isAdmin) {
      res.status(400).send({
        message: "Account does not exist",
      });

      return;
    }

    const isMatch = await bcryptjs.compare(password, isAdmin.password);
    if (!isMatch) {
      res.status(400).send({
        message: "Invalid credentials",
      });

      return;
    }

    // const userData = isUser.toObject();
    // delete userData.password;
    const token = jwt.sign(
      { id: isAdmin._id, role: isAdmin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "5h",
        algorithm: "HS256",
      },
    );

    // res.status(201).send({
    //     message: "Login successful",
    //     data: {
    //         firstname: isUser.firstname,
    //         lastname: isUser.lastname,
    //         email: isUser.email,
    //         token,
    //     },
    // });
    res.status(200).send({
      message: "Login Successful",
      data: {
        firstname: isAdmin.firstname,
        lastname: isAdmin.lastname,
        email: isAdmin.email,
        token,
        role,
        tag: isAdmin.tag ? isAdmin.tag : null,
      },
    });
  } catch (error) {
    res.status(400).send({
      message: "Invalid credentials",
    });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1]
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"].split(" ")[0];

    const user = await jwt.verify(
      token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) {
          console.error("JWT verification error:", err);

          res.status(401).send({
            message: "User unauthorized!",
          });
          return;
        }

        req.user = decoded;
        console.log(decoded);

        next();
      },
    );
  } catch (error) {
    console.log(error);

    res.status(401).send({
      message: "User unauthorized!",
    });
    return;
  }
};

const updateUser = async (req, res) => {
  const { id, role } = req.user;
  const { firstname, lastname, phonenumber } = req.body;

  if (!["user", "driver", "admin"].includes(role)) {
    return res.status(403).send({
      message: "Forbidden resource",
    });
  }

  const allowedUpdate = {};
  if (typeof firstname === "string") {
    allowedUpdate.firstname = firstname.trim();
  }
  if (typeof lastname === "string") {
    allowedUpdate.lastname = lastname.trim();
  }
  if (typeof phonenumber === "string") {
    allowedUpdate.phonenumber = phonenumber.trim();
  }

  if (
    !Object.keys(allowedUpdate).length ||
    (allowedUpdate.firstname !== undefined && !allowedUpdate.firstname) ||
    (allowedUpdate.lastname !== undefined && !allowedUpdate.lastname)
  ) {
    return res.status(400).send({
      message: "Provide a valid first name, last name or phone number to update",
    });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      allowedUpdate,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    return res.status(200).send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update failed:", error);
    return res.status(500).send({
      message: "Cannot update user",
    });
  }
};

const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;
  const { currentpassword, newpassword } = req.body;
  try {
    if (role !== "operator" && role !== "admin") {
      res.status(403).send({
        message: "Forbidden resource",
      });
      return;
    }

    const allowedUpdate = {
      ...(firstname && { firstname: firstname.trim() }),
      ...(lastname && { lastname: lastname.trim() }),
    };

    const updatehashPass = await bcryptjs.hash(password, saltround);

    const updateUser = await UserModel.findByIdAndUpdate(
      { id },
      allowedUpdate,
      { returnDocument: "after", runValidators },
    );

    if (!updateUser) {
      res.status(400).send({
        message: "Cannot update password at this time",
      });
    }

    res.status(200).send({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Cannot update password",
    });
    return;
  }
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  loginAdmin,
  getUser,
  getAdmin,
  getDriver,
  verifyUser,
  updateUser,
  getUserByAdmin,
  registerAdmin,
  registerDriver,
  updateUserPassword,
  getUsersByRole,
  deleteUser,
};
