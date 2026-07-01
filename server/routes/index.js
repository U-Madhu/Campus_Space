import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import blogRoutes from "./blog.routes.js";
import commentRoutes from "./comment.routes.js";
import notificationRoutes from "./notification.routes.js";

const router = express.Router();

router.use(authRoutes);
router.use(userRoutes);
router.use(blogRoutes);
router.use(commentRoutes);
router.use(notificationRoutes);

export default router;
