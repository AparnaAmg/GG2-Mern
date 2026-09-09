const pool = require("../config/db");

// =====================================================
// GET ALL MENUS
// =====================================================

exports.getMenus = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        slug,
        location,
        created_at,
        updated_at
      FROM gg2_menus
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      menus: result.rows,
    });

  } catch (error) {
    console.error("GET MENUS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// GET SINGLE MENU
// =====================================================

exports.getMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const menuResult = await pool.query(
      `
      SELECT *
      FROM gg2_menus
      WHERE id = $1
      `,
      [id]
    );

    if (menuResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    const itemsResult = await pool.query(
      `
      SELECT *
      FROM gg2_menu_items
      WHERE menu_id = $1
      ORDER BY position ASC, id ASC
      `,
      [id]
    );

    res.json({
      success: true,
      menu: menuResult.rows[0],
      items: itemsResult.rows,
    });

  } catch (error) {
    console.error("GET MENU ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// CREATE MENU
// =====================================================

exports.createMenu = async (req, res) => {
  try {
    const {
      name,
      location,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Menu name is required",
      });
    }

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await pool.query(
      `
      INSERT INTO gg2_menus
      (
        name,
        slug,
        location
      )
      VALUES
      ($1, $2, $3)
      RETURNING *
      `,
      [
        name.trim(),
        slug,
        location || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Menu created successfully",
      menu: result.rows[0],
    });

  } catch (error) {
    console.error("CREATE MENU ERROR:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "A menu with this name already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// UPDATE MENU
// =====================================================

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      location,
    } = req.body;

    const existing = await pool.query(
      `
      SELECT *
      FROM gg2_menus
      WHERE id = $1
      `,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    const menu = existing.rows[0];

    const updatedName =
      name?.trim() || menu.name;

    const slug = updatedName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const result = await pool.query(
      `
      UPDATE gg2_menus
      SET
        name = $1,
        slug = $2,
        location = $3,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [
        updatedName,
        slug,
        location ?? menu.location,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Menu updated successfully",
      menu: result.rows[0],
    });

  } catch (error) {
    console.error("UPDATE MENU ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// DELETE MENU
// =====================================================

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM gg2_menus
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    res.json({
      success: true,
      message: "Menu deleted successfully",
    });

  } catch (error) {
    console.error("DELETE MENU ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};