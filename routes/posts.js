import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


router.get("/", verifyToken, getFeedPosts); //to show post of other users of the app
router.get("/:userId", verifyToken, getUserPosts); //to show post of verified user


router.patch("/:id/like", verifyToken, likePost);

export default router;
