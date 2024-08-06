import { Users, validationUser } from "../module/userSchema.js";

import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
class UsersController {
  async getProfile(req, res) {
    try {
      let user = await Users.findById(req.user._id);
      res.status(200).json({
        msg: "User registered successfully",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: err.message,
        variant: "error",
        payload: null,
      });
    }
  }
  async updateProfile(req, res) {
    try {
      let profile = await Users.findOne({ _id: req.user._id });
      if (!profile) {
        return res.status(404).json({
          msg: "Profile not found.",
          variant: "error",
          payload: null,
        });
      }

      const existingUser = await Users.findOne({ username: req.body.username });
      if (
        existingUser &&
        existingUser._id.toString() !== req.user._id.toString()
      ) {
        return res.status(400).json({
          msg: "Username already exists.",
          variant: "error",
          payload: null,
        });
      }

      if (!req.body.password) {
        req.body.password = profile.password;
      }

      const newProfile = await Users.findByIdAndUpdate(req.user._id, req.body, {
        new: true,
      });

      res.status(200).json({
        msg: "Profile is updated",
        variant: "success",
        payload: newProfile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async updatePassword(req, res) {
    try {
      // Foydalanuvchini bazadan topish
      const user = await Users.findById(req.user._id);
      if (!user) {
        return res.status(404).json({
          msg: "User not found.",
          variant: "error",
          payload: null,
        });
      }

      // Eski parolni tekshirish
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({
          msg: "Incorrect old password.",
          variant: "error",
          payload: null,
        });
      }

      // Yangi parolni xesh qilish va saqlash
      const newHashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      user.password = newHashedPassword;
      await user.save();

      res.status(200).json({
        msg: "Password updated successfully",
        variant: "success",
        payload: null,
      });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }

  async get(req, res) {
    try {
      const { limit = 10, skip = 1 } = req.query;
      const users = await Users.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(limit * (skip - 1));
      if (!users.length) {
        return res.status(400).json({
          msg: "Users is not defined",
          variant: "warning",
          payload: null,
        });
      }
      const total = await Users.countDocuments();
      res.status(200).json({
        msg: "All Users",
        variant: "success",
        payload: users,
        total,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async create(req, res) {
    try {
      const { error } = validationUser(req.body);
      if (error) {
        return res.status(400).json({
          msg: error.details[0].message,
          variant: "warning",
          payload: null,
        });
      }
      const existUser = await Users.exists({ title: req.body.username });
      if (existUser) {
        return res.status(400).json({
          msg: "This username has been used",
          variant: "warning",
          payload: null,
        });
      }

      req.body.password = await bcrypt.hash(req.body.password, 10);
      const user = await Users.create(req.body);
      res.status(201).json({
        msg: "User is created",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async register(req, res) {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username });

      if (!user) {
        return res.status(400).json({
          msg: "username xato ",
          variant: "error",
          payload: null,
        });
      }

      bcrypt.compare(password, user.password, function (err, response) {
        const token = jwt.sign(
          { _id: user._id, role: "admin" },
          process.env.SECRET_KEY
        );
        if (response) {
          res.status(200).json({
            msg: "Log in ",
            variant: "success",
            payload: user,
            token,
          });
        } else {
          return res.status(400).json({
            msg: "password is wrong",
            variant: "error",
            payload: null,
          });
        }
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async delete(req, res) {
    try {
      const { id } = req.params;
      const existUser = await Users.findById(id);
      if (!existUser) {
        return res.status(400).json({
          msg: "User is not defined",
          variant: "warning",
          payload: null,
        });
      }
      const user = await Users.findByIdAndDelete(id, { new: true });

      res.status(200).json({
        msg: "user is deleted",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
  async update(req, res) {
    try {
      const { id } = req.params;
      const existingUser = await Users.findOne({ username: req.body.username });
      if (existingUser && existingUser._id.toString() !== id)
        return res.status(400).json({
          msg: "User already exists.",
          variant: "error",
          payload: null,
        });
      res.body.password = existingUser.password;
      const user = await Users.findByIdAndUpdate(id, req.body, { new: true });

      res.status(200).json({
        msg: "User is updated",
        variant: "success",
        payload: user,
      });
    } catch {
      res.status(500).json({
        msg: "Server error",
        variant: "error",
        payload: null,
      });
    }
  }
}

export default new UsersController();
