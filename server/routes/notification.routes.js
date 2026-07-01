import express from "express";
import { newNotification, getNotifications, allNotificationsCount } from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/new-notification", verifyJWT, newNotification);
router.post("/notifications", verifyJWT, getNotifications);
router.post("/all-notifications-count", verifyJWT, allNotificationsCount);

export default router;
