const pool = require("../config/db");
const bcrypt = require("bcrypt");

// ===================== GET ALL USERS =====================

const getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        u.id,
        u.user_login,
        u.display_name,
        u.user_email,
        r.display_name AS role,
        u.is_active,
        u.user_registered
      FROM gg2_users u
      LEFT JOIN gg2_roles r
      ON u.role_id = r.id
      ORDER BY u.id
    `);

    res.json({
      success: true,
      users: result.rows
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};

// ===================== ADD USER =====================

const addUser = async (req, res) => {

  try {

    const {
      user_login,
      user_email,
      password,
      first_name,
      last_name,
      role_id,
      phone
    } = req.body;

    // Check existing email

    const check = await pool.query(
      "SELECT * FROM gg2_users WHERE user_email=$1",
      [user_email]
    );

    if (check.rows.length > 0) {

      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });

    }

    const hash = await bcrypt.hash(password,10);

    await pool.query(

      `INSERT INTO gg2_users
      (
      user_login,
      user_pass,
      user_email,
      first_name,
      last_name,
      display_name,
      phone,
      role_id
      )

      VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,

      [

        user_login,
        hash,
        user_email,
        first_name,
        last_name,
        first_name + " " + last_name,
        phone,
        role_id

      ]

    );

    res.json({

      success:true,
      message:"User Added Successfully"

    });

  } catch(err){

    console.log(err);

    res.status(500).json({

      success:false,
      message:err.message

    });

  }

};
//Edit User 
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM gg2_users WHERE id=$1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    delete result.rows[0].user_pass;

    res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      user_login,
      user_email,
      first_name,
      last_name,
      phone,
      role_id,
      is_active
    } = req.body;

    await pool.query(
      `UPDATE gg2_users
       SET user_login=$1,
           user_email=$2,
           first_name=$3,
           last_name=$4,
           phone=$5,
           role_id=$6,
           is_active=$7,
           display_name=$8
       WHERE id=$9`,
      [
        user_login,
        user_email,
        first_name,
        last_name,
        phone,
        role_id,
        is_active,
        `${first_name} ${last_name}`,
        id
      ]
    );

    res.json({
      success: true,
      message: "User updated successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
//Delete
const deleteUser = async (req, res) => {
  try {

    await pool.query(
      `UPDATE gg2_users
       SET is_active=false
       WHERE id=$1`,
      [req.params.id]
    );

    res.json({
      success: true,
      message: "User deactivated"
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};
module.exports={

getUsers,

addUser,
 getUserById,
  updateUser,
  deleteUser

};