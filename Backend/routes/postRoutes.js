const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
    getPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost
} = require("../controllers/postController");

// =========================
// Get All Posts
// =========================
router.get(
    "/",
    authorizeRoles("super_admin", "author"),
    getPosts
);

// =========================
// Add Post
// =========================
router.post(
    "/",
    authorizeRoles("super_admin", "author"),
    upload.single("featuredImage"),
    addPost
);

// =========================
// Get Single Post
// =========================
router.get(
    "/:id",
    authorizeRoles("super_admin", "author"),
    getPostById
);

// =========================
// Update Post
// =========================
router.put(
    "/:id",
    authorizeRoles("super_admin", "author"),
    upload.single("featuredImage"),
    updatePost
);

// =========================
// Delete Post
// =========================
router.delete(
    "/:id",
    authorizeRoles("super_admin", "author"),
    deletePost
);

module.exports = router;