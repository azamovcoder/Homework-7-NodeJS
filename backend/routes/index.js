import BlogsController from "../controller/blog.js";
import UsersController from "../controller/user.js";
import { adminMiddleware } from "../middleware/admin-middleware.js";
import { auth } from "../middleware/auth.js";
import express from "express";
import { ownerMiddleware } from "../middleware/owner-middleware.js";

const router = express.Router();
// Blogs
router.get(
  "/api/blogs",
  [auth, adminMiddleware || ownerMiddleware],
  BlogsController.get
);
router.get("/api/blogs/search", [auth], BlogsController.getBlogSearch);
router.post("/api/blogs", [auth], BlogsController.create);
router.delete("/blogs/:id", [auth], BlogsController.delete);
// Profile
router.get("/api/profile", [auth], UsersController.getProfile);
router.patch("/api/update/profile", [auth], UsersController.updateProfile);
router.patch(
  "/api/update/password/profile",
  [auth],
  UsersController.updatePassword
);

// Users
router.get("/api/users/search", [auth], UsersController.getUserSearch);
router.get("/users", [auth], UsersController.get);
router.post("/users/sign-up", UsersController.create);
router.post("/users/sign-in", UsersController.register);
router.delete("/users/:id", [auth], UsersController.delete);
router.put("/users/:id", UsersController.update);

export default router;
