import express from "express";
import { getUploadUrl, latestBlogs, allLatestBlogsCount, trendingBlogs, searchBlogs, searchBlogsCount, createBlog, getBlog, likeBlog, isLikedByUser } from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/get-upload-url", getUploadUrl);
router.post("/latest-blogs", latestBlogs);
router.post("/all-latest-blogs-count", allLatestBlogsCount);
router.get("/trending-blogs", trendingBlogs);
router.post("/search-blogs", searchBlogs);
router.post("/search-blogs-count", searchBlogsCount);
router.post("/create-blogs", verifyJWT, createBlog);
router.post("/get-blog", getBlog);
router.post("/like-blog", verifyJWT, likeBlog);
router.post("/isliked-by-user", verifyJWT, isLikedByUser);

export default router;
