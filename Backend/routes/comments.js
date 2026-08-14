const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/*
=====================================================
UPDATE POST COMMENT COUNT
=====================================================
*/
async function updatePostCommentCount(postId) {
  await pool.query(
    `
    UPDATE gg2_posts
    SET comment_count = (
      SELECT COUNT(*)
      FROM gg2_comments
      WHERE post_id = $1
        AND comment_status = 'approved'
    )
    WHERE id = $1
    `,
    [postId]
  );
}

/*
=====================================================
GET ALL COMMENTS
GET /api/comments
=====================================================
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id,
        c.post_id,
        c.author_name,
        c.author_email,
        c.author_url,
        c.comment_content,
        c.comment_status,
        c.parent_id,
        c.created_at,
        c.updated_at,
        p.post_title
      FROM gg2_comments c
      LEFT JOIN gg2_posts p
        ON c.post_id = p.id
      ORDER BY c.created_at DESC
    `);

    res.status(200).json({
      success: true,
      comments: result.rows,
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
GET COMMENTS FOR POST
GET /api/comments/post/:postId
=====================================================
*/
router.get("/post/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.id,
        c.post_id,
        c.author_name,
        c.author_email,
        c.author_url,
        c.comment_content,
        c.comment_status,
        c.parent_id,
        c.created_at,
        c.updated_at,
        p.post_title
      FROM gg2_comments c
      LEFT JOIN gg2_posts p
        ON c.post_id = p.id
      WHERE c.post_id = $1
      ORDER BY c.created_at DESC
      `,
      [postId]
    );

    res.status(200).json({
      success: true,
      comments: result.rows,
    });
  } catch (error) {
    console.error("GET POST COMMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
GET SINGLE COMMENT
GET /api/comments/:id
=====================================================
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        c.*,
        p.post_title
      FROM gg2_comments c
      LEFT JOIN gg2_posts p
        ON c.post_id = p.id
      WHERE c.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(200).json({
      success: true,
      comment: result.rows[0],
    });
  } catch (error) {
    console.error("GET COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
CREATE COMMENT
POST /api/comments
=====================================================
*/
router.post("/", async (req, res) => {
  try {
    console.log("====================================");
    console.log("POST /api/comments HIT");
    console.log("BODY:", req.body);
    console.log("====================================");

    const {
      post_id,
      author_name,
      author_email,
      author_url,
      comment_content,
      parent_id,
    } = req.body;

    /*
    -----------------------------------------------
    VALIDATION
    -----------------------------------------------
    */

    if (!post_id) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    if (!author_name || !author_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Author name is required",
      });
    }

    if (!comment_content || !comment_content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    /*
    -----------------------------------------------
    CHECK POST
    -----------------------------------------------
    */

    const postCheck = await pool.query(
      `
      SELECT id
      FROM gg2_posts
      WHERE id = $1
      `,
      [post_id]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    /*
    -----------------------------------------------
    INSERT COMMENT
    -----------------------------------------------
    */

    const result = await pool.query(
      `
      INSERT INTO gg2_comments
      (
        post_id,
        author_name,
        author_email,
        author_url,
        comment_content,
        comment_status,
        parent_id
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        'pending',
        $6
      )
      RETURNING *
      `,
      [
        Number(post_id),
        author_name.trim(),
        author_email?.trim() || null,
        author_url?.trim() || null,
        comment_content.trim(),
        parent_id || null,
      ]
    );

    /*
    -----------------------------------------------
    UPDATE POST COMMENT COUNT
    -----------------------------------------------
    */

    await updatePostCommentCount(post_id);

    /*
    -----------------------------------------------
    RESPONSE
    -----------------------------------------------
    */

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: result.rows[0],
    });
  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
UPDATE COMMENT
PUT /api/comments/:id
=====================================================
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      author_name,
      author_email,
      author_url,
      comment_content,
      comment_status,
    } = req.body;

    const existing = await pool.query(
      `
      SELECT *
      FROM gg2_comments
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const comment = existing.rows[0];

    const result = await pool.query(
      `
      UPDATE gg2_comments
      SET
        author_name = $1,
        author_email = $2,
        author_url = $3,
        comment_content = $4,
        comment_status = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
      `,
      [
        author_name ?? comment.author_name,
        author_email ?? comment.author_email,
        author_url ?? comment.author_url,
        comment_content ?? comment.comment_content,
        comment_status ?? comment.comment_status,
        id,
      ]
    );

    await updatePostCommentCount(comment.post_id);

    res.json({
      success: true,
      message: "Comment updated successfully",
      comment: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
UPDATE COMMENT STATUS
PUT /api/comments/:id/status
=====================================================
*/
router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "spam",
      "trash",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment status",
      });
    }

    const existing = await pool.query(
      `
      SELECT *
      FROM gg2_comments
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const result = await pool.query(
      `
      UPDATE gg2_comments
      SET
        comment_status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    await updatePostCommentCount(
      result.rows[0].post_id
    );

    res.json({
      success: true,
      message: `Comment marked as ${status}`,
      comment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "UPDATE COMMENT STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
DELETE COMMENT
DELETE /api/comments/:id
=====================================================
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await pool.query(
      `
      SELECT post_id
      FROM gg2_comments
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const postId = existing.rows[0].post_id;

    await pool.query(
      `
      DELETE FROM gg2_comments
      WHERE id = $1
      `,
      [id]
    );

    await updatePostCommentCount(postId);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("DELETE COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;