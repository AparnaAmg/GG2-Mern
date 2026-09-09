const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    

const result = await pool.query(
  `
  SELECT
      u.*,
      r.role_name
  FROM gg2_users u
  JOIN gg2_roles r
    ON r.id = u.role_id
  WHERE u.user_email = $1
    AND u.is_active = true
  `,
  [email]
);

    

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.user_pass);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role_name,
        email: user.user_email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    delete user.user_pass;

    res.json({
      success: true,
      token,
      user
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

module.exports = { login };