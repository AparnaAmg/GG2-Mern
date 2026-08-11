const pool = require("../config/db");

// Get All Categories
const getCategories = async (req, res) => {
  try {
   const result = await pool.query(`
SELECT
    c.id,
    c.category_name,
    c.slug,
    c.description,
    c.parent_id,
    p.category_name AS parent_category,
    COALESCE(c.post_count, 0) AS post_count
FROM gg2_categories c
LEFT JOIN gg2_categories p
ON c.parent_id = p.id
ORDER BY c.category_name;
`);

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add Category
const addCategory = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const {
      category_name,
      slug,
      parent_id,
      description,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO gg2_categories
      (
        category_name,
        slug,
        description,
        parent_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [
        category_name,
        slug,
        description || null,
        parent_id === "" ? null : parent_id,
      ]
    );

    res.json({
      success: true,
      category: result.rows[0],
    });

  } catch (err) {
    console.error("CATEGORY INSERT ERROR");
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Category
const deleteCategory = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM gg2_categories WHERE id=$1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Category Deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
};