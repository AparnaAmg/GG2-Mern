const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/*
=====================================================
GET ALL THEMES
GET /api/themes
=====================================================
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        theme_name,
        theme_slug,
        description,
        version,
        author,
        theme_image,
        status,
        created_at,
        updated_at
      FROM gg2_themes
      ORDER BY
        CASE
          WHEN status = 'active' THEN 0
          ELSE 1
        END,
        created_at DESC
    `);

    res.json({
      success: true,
      themes: result.rows,
    });
  } catch (error) {
    console.error("GET THEMES ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
GET ACTIVE THEME
GET /api/themes/active
=====================================================
*/
router.get("/active", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM gg2_themes
      WHERE status = 'active'
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No active theme found",
      });
    }

    res.json({
      success: true,
      theme: result.rows[0],
    });
  } catch (error) {
    console.error("GET ACTIVE THEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
GET SINGLE THEME
GET /api/themes/:id
=====================================================
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT *
      FROM gg2_themes
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Theme not found",
      });
    }

    res.json({
      success: true,
      theme: result.rows[0],
    });
  } catch (error) {
    console.error("GET THEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
=====================================================
ACTIVATE THEME
PUT /api/themes/:id/activate
=====================================================
*/
router.put("/:id/activate", async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    // Check theme exists
    const themeCheck = await client.query(
      `
      SELECT *
      FROM gg2_themes
      WHERE id = $1
      `,
      [id]
    );

    if (themeCheck.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Theme not found",
      });
    }

    // Deactivate all themes
    await client.query(`
      UPDATE gg2_themes
      SET
        status = 'inactive',
        updated_at = CURRENT_TIMESTAMP
    `);

    // Activate selected theme
    const result = await client.query(
      `
      UPDATE gg2_themes
      SET
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Theme activated successfully",
      theme: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("ACTIVATE THEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    client.release();
  }
});

/*
=====================================================
DELETE THEME
DELETE /api/themes/:id
=====================================================
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const themeCheck = await pool.query(
      `
      SELECT status
      FROM gg2_themes
      WHERE id = $1
      `,
      [id]
    );

    if (themeCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Theme not found",
      });
    }

    if (themeCheck.rows[0].status === "active") {
      return res.status(400).json({
        success: false,
        message: "Active theme cannot be deleted",
      });
    }

    await pool.query(
      `
      DELETE FROM gg2_themes
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      success: true,
      message: "Theme deleted successfully",
    });
  } catch (error) {
    console.error("DELETE THEME ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;