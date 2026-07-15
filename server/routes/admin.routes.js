import express from "express";
import { getBlogs, approveBlog, approveBlogLink, deleteBlog, getUsers, deleteUser, changeRole } from "../controllers/admin.controller.js";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public link to approve from email
router.get("/approve-blog-link/:blog_id", approveBlogLink);

// Protected admin dashboard actions
router.post("/blogs", verifyJWT, verifyAdmin, getBlogs);
router.post("/approve-blog", verifyJWT, verifyAdmin, approveBlog);
router.post("/delete-blog", verifyJWT, verifyAdmin, deleteBlog);
router.post("/users", verifyJWT, verifyAdmin, getUsers);
router.post("/delete-user", verifyJWT, verifyAdmin, deleteUser);
router.post("/change-role", verifyJWT, verifyAdmin, changeRole);

export default router;
