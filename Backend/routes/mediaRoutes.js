const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");

const {
  uploadMedia,
  getMedia,
  getMediaById,
  deleteMedia,
} = require("../controllers/mediaController");

// Get all media
router.get("/", getMedia);

// Get media by ID
router.get("/:id", getMediaById);

// Upload media
router.post(
  "/upload",
  upload.single("file"),
  uploadMedia
);

// Delete media
router.delete("/:id", deleteMedia);

module.exports = router;