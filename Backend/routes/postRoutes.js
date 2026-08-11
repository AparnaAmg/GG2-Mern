const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");

const {

    getPosts,
    getPostById,

    addPost,
     updatePost,

    deletePost

} = require("../controllers/postController");
// Get all posts
router.get("/", getPosts);

router.post(

    "/",

    upload.single("featuredImage"),

    addPost

);
// Get single post
router.get("/:id", getPostById);

// Add post
router.put("/:id", upload.single("featuredImage"), updatePost);
// Delete post
router.delete("/:id", deletePost);

module.exports = router;