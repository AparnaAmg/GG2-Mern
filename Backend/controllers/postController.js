const pool = require("../config/db");

// =========================
// Get All Posts
// =========================
// =========================
// Get All Posts
// =========================
const getPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
          p.id,
          p.post_title,
          p.post_name,
          p.post_status,
          p.post_date,
          p.guid,
          u.display_name AS author
      FROM gg2_posts p
      LEFT JOIN gg2_users u
          ON p.post_author = u.id
      WHERE p.post_type = 'post'
      AND p.is_deleted = false
      ORDER BY p.post_date DESC
    `);

    res.json({
      success: true,
      posts: result.rows,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// =========================
// Add New Post
// =========================
const addPost = async (req, res) => {

    try {
       console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const {
            title,
            slug,
            content,
            excerpt,
            status,
            author
        } = req.body;
console.log("AUTHOR:", author);
        const featuredImage = req.file
            ? req.file.filename
            : "";

        await pool.query(

`
INSERT INTO gg2_posts
(
post_author,
post_date,
post_date_gmt,
post_content,
post_title,
post_excerpt,
post_status,
comment_status,
ping_status,
post_password,
post_name,
post_modified,
post_modified_gmt,
post_parent,
guid,
menu_order,
post_type
)

VALUES
(
$1,
NOW(),
NOW(),
$2,
$3,
$4,
$5,
'open',
'open',
'',
$6,
NOW(),
NOW(),
0,
$7,
0,
'post'
)
`,

[
author,
content,
title,
excerpt,
status,
slug,
featuredImage
]

        );

        res.json({
            success:true,
            message:"Post Added"
        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

}
// =========================
// Get Single Post
// =========================
const getPostById = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM gg2_posts
            WHERE id=$1
            `,
            [req.params.id]
        );

        res.json({
            success: true,
            post: result.rows[0]
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};
// =========================
// Edit Post
// =========================
const updatePost = async (req, res) => {

  try {

    const {
      title,
      slug,
      content,
      excerpt,
      status,
      author
    } = req.body;

    let image = "";

    if (req.file) {

      image = req.file.filename;

      await pool.query(
        `
        UPDATE gg2_posts
        SET

        post_author=$1,
        post_title=$2,
        post_name=$3,
        post_content=$4,
        post_excerpt=$5,
        post_status=$6,
        guid=$7,
        post_modified=NOW(),
        post_modified_gmt=NOW()

        WHERE id=$8
        `,
        [
          author,
          title,
          slug,
          content,
          excerpt,
          status,
          image,
          req.params.id,
        ]
      );

    }

    else {

      await pool.query(
        `
        UPDATE gg2_posts
        SET

        post_author=$1,
        post_title=$2,
        post_name=$3,
        post_content=$4,
        post_excerpt=$5,
        post_status=$6,
        post_modified=NOW(),
        post_modified_gmt=NOW()

        WHERE id=$7
        `,
        [
          author,
          title,
          slug,
          content,
          excerpt,
          status,
          req.params.id,
        ]
      );

    }

    res.json({
      success: true,
      message: "Post Updated Successfully",
    });

  }

  catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};
// =========================
// Delete Post
// =========================
const deletePost = async (req, res) => {
  try {
    console.log("DELETE POST ID:", req.params.id);
    console.log("DELETE USER:", req.user);

    const result = await pool.query(
      `
      UPDATE gg2_posts
      SET is_deleted = true
      WHERE id = $1
      `,
      [req.params.id]
    );

    console.log("DELETE RESULT:", result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.json({
      success: true,
      message: "Post Deleted Successfully",
    });

  } catch (err) {
    console.error("DELETE POST ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =========================
// Export
// =========================
module.exports = {
  getPosts,
  getPostById,
  addPost,
  updatePost,
  deletePost,
};