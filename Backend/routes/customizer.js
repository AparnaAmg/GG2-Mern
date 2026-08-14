const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/*
=====================================================
GET CUSTOMIZER SETTINGS
GET /api/customizer
=====================================================
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        setting_key,
        setting_value
      FROM gg2_customizer_settings
      ORDER BY id ASC
    `);

    const settings = {};

    result.rows.forEach((row) => {
      settings[row.setting_key] =
        row.setting_value;
    });

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "GET CUSTOMIZER ERROR:",
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
UPDATE CUSTOMIZER SETTINGS
PUT /api/customizer
=====================================================
*/
router.put("/", async (req, res) => {
  const client = await pool.connect();

  try {
    const settings = req.body;

    await client.query("BEGIN");

    for (const [key, value] of Object.entries(
      settings
    )) {
      await client.query(
        `
        INSERT INTO gg2_customizer_settings
        (
          setting_key,
          setting_value,
          updated_at
        )
        VALUES ($1, $2, CURRENT_TIMESTAMP)

        ON CONFLICT (setting_key)
        DO UPDATE SET
          setting_value = EXCLUDED.setting_value,
          updated_at = CURRENT_TIMESTAMP
        `,
        [
          key,
          String(value),
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      success: true,
      message:
        "Customizer settings saved successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "UPDATE CUSTOMIZER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    client.release();
  }
});

module.exports = router;