const express = require("express");
const multer = require("multer");

const router = express.Router();

const pool = require("../config/db");

// Multer configuration
const upload = multer({
  dest: "uploads/pages/",
});

// GET ALL PAGES
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM gg2_pages
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      pages: result.rows,
    });
  } catch (error) {
    console.error("GET PAGES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET SINGLE PAGE
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM gg2_pages
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.json({
      success: true,
      page: result.rows[0],
    });
  } catch (error) {
    console.error("GET PAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE PAGE
router.post("/", upload.single("featuredImage"), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    const {
      title,
      slug,
      content,
      excerpt,
      status,
      author,
    } = req.body;

    if (!title || !slug) {
      return res.status(400).json({
        success: false,
        message: "Title and slug are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO gg2_pages
      (
        post_author,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        post_name,
        post_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'page')
      RETURNING *
      `,
      [
        author || 1,
        content || "",
        title,
        excerpt || "",
        status || "draft",
        slug,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Page created successfully",
      page: result.rows[0],
    });

  } catch (error) {
    console.error("CREATE PAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE PAGE
router.put("/:id", upload.single("featuredImage"), async (req, res) => {
  try {
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILE:", req.file);

    const { id } = req.params;

    const {
      title,
      slug,
      content,
      excerpt,
      status,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE gg2_pages
      SET
        post_title = $1,
        post_name = $2,
        post_content = $3,
        post_excerpt = $4,
        post_status = $5,
        post_modified = NOW()
      WHERE id = $6
      RETURNING *
      `,
      [
        title,
        slug,
        content || "",
        excerpt || "",
        status || "draft",
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.json({
      success: true,
      message: "Page updated successfully",
      page: result.rows[0],
    });

  } catch (error) {
    console.error("UPDATE PAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE PAGE
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM gg2_pages
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.json({
      success: true,
      message: "Page deleted successfully",
    });

  } catch (error) {
    console.error("DELETE PAGE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;