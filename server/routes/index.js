import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import blogRoutes from "./blog.routes.js";
import commentRoutes from "./comment.routes.js";
import notificationRoutes from "./notification.routes.js";
import adminRoutes from "./admin.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import { authLimiter, generalLimiter } from "../middlewares/rate-limit.middleware.js";

const router = express.Router();

// Apply auth rate limiting to auth routes
const authRouter = express.Router();
authRouter.use(authLimiter);
authRouter.use(authRoutes);
router.use(authRouter);

// Apply general rate limiting to all other routes
const generalRouter = express.Router();
generalRouter.use(generalLimiter);
generalRouter.use(userRoutes);
generalRouter.use(blogRoutes);
generalRouter.use(commentRoutes);
generalRouter.use(notificationRoutes);
generalRouter.use("/admin", adminRoutes);
generalRouter.use(analyticsRoutes);
router.use(generalRouter);

export default router;
